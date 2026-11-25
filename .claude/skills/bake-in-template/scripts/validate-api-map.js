// Usage: node .claude/skills/bake-in-template/scripts/validate-api-map.js <api-map.json> [<SCRATCH_DIR> <SOURCE_API_VERSION> '<CAPTURE_PARAMS json>' <fixture>...]  (run from the repo root)
// Prints one line per rule violation, then OK or FAIL. Exit 1 on any violation.
// With the optional arguments it also runs every calls[] row on each fixture: `old` on the old generator's
// parsed document, `v3` on the repo parser's, and compares the results.
const fs = require('fs');
const path = require('path');

const [apiMapFile, scratchArg, apiVersion, paramsJson, ...fixtures] = process.argv.slice(2);
const apiMap = JSON.parse(fs.readFileSync(apiMapFile, 'utf8'));
// Why: a source with no filters (common for React) gets an api-map.json with no `filters` key.
const rows = [...(apiMap.calls || []), ...(apiMap.filters || [])];
const problems = [];

// Every replacement needs grep evidence, except `v3: "NONE"` rows and source filters ported as a new helper.
for (const row of rows) {
  const needsEvidence = row.v3 !== 'NONE' && !(row.origin === 'local' && row.replacement === 'new-helper');
  const hasEvidence = (row.grepEvidence || []).length > 0;
  if (needsEvidence && !hasEvidence) problems.push(`${row.id}: no grepEvidence`);
}

// Ids must be unique across calls[] and filters[].
const seenIds = new Set();
for (const row of rows) {
  if (seenIds.has(row.id)) problems.push(`${row.id}: duplicate id`);
  seenIds.add(row.id);
}

// Chains can only run when they start from a value we can bind. Others (e.g. `f` inside a package filter) are skipped.
const BOUND_RECEIVERS = ['asyncapi', 'params', 'channel'];

function runChain(chain, scope) {
  try {
    const fn = new Function(...Object.keys(scope), `return (${chain});`);
    return { value: fn(...Object.values(scope)) };
  } catch (error) {
    return { error: error.message };
  }
}

// null, undefined, {} and [] all mean "nothing there": the old API often returned {} or null where the new one returns undefined.
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (Array.isArray(value)) return value.length === 0;
  return typeof value === 'object' && value.constructor === Object && Object.keys(value).length === 0;
}

function describe(result) {
  if (result.error) return `throws "${result.error}"`;
  const value = result.value;
  if (isEmpty(value)) return '<empty>';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value) && value.every((item) => typeof item !== 'object')) return JSON.stringify(value);
  return '<object>';
}

function isSame(row, oldResult, v3Result) {
  // A row added for a change has no old chain; its v3 chain only has to run.
  if (!row.old) return !v3Result.error;
  // The old chain throwing means the data is absent and the source guarded it, so there is nothing to compare.
  if (oldResult.error) return true;
  return describe(oldResult) === describe(v3Result);
}

async function parseOld(text, fixture) {
  const scratchDir = path.resolve(scratchArg);
  const oldParser = require(path.join(scratchDir, 'oldgen', 'node_modules', '@asyncapi', 'generator', 'lib', 'parser.js'));
  const templateConfig = apiVersion === 'none' ? {} : { apiVersion };
  const { document } = await oldParser.parse(text, { path: path.resolve(fixture) }, { templateConfig });
  if (!document) throw new Error(`The old generator's parser could not parse ${fixture}`);
  return document;
}

async function parseV3(text, fixture) {
  // Parse as the generator does for apiVersion v3 templates: schema parsers included, so Avro fixtures parse.
  const { NewParser } = require('@asyncapi/multi-parser');
  const parser = NewParser(3, { includeSchemaParsers: true });
  const { document } = await parser.parse(text, { source: path.resolve(fixture) });
  if (!document) throw new Error(`The repo parser could not parse ${fixture}`);
  return document;
}

// The old API returns a name → channel map; the newer APIs return a collection.
function findOldChannel(oldDoc, name) {
  const channels = oldDoc.channels();
  return typeof channels.get === 'function' ? channels.get(name) : channels[name];
}

async function runRows(fixture) {
  const text = fs.readFileSync(fixture, 'utf8');
  const oldDoc = await parseOld(text, fixture);
  const v3Doc = await parseV3(text, fixture);
  const params = JSON.parse(paramsJson);
  const documentScope = { old: { asyncapi: oldDoc, params }, v3: { asyncapi: v3Doc, params } };
  const channelScopes = v3Doc.channels().all().map((channel) => ({
    label: ` [channel ${channel.id()}]`,
    old: { ...documentScope.old, channel: findOldChannel(oldDoc, channel.id()) },
    v3: { ...documentScope.v3, channel }
  }));

  for (const row of apiMap.calls) {
    if (row.v3 !== 'NONE') checkRow(row, fixture, documentScope, channelScopes);
  }
}

function checkRow(row, fixture, documentScope, channelScopes) {
  const receiver = (row.old || row.v3).split(/[.(]/)[0].trim();
  if (!BOUND_RECEIVERS.includes(receiver)) {
    console.log(`${row.id} ${fixture}: not run (receiver "${receiver}")`);
    return;
  }
  const scopes = receiver === 'channel' ? channelScopes : [{ label: '', ...documentScope }];
  if (!scopes.length) console.log(`${row.id} ${fixture}: not run (no channels)`);
  for (const scope of scopes) {
    const oldResult = row.old ? runChain(row.old, scope.old) : null;
    const v3Result = runChain(row.v3, scope.v3);
    const same = isSame(row, oldResult, v3Result);
    const line = `${row.id} ${fixture}${scope.label}: old=${row.old ? describe(oldResult) : '-'} v3=${describe(v3Result)}`;
    console.log(`${same ? 'same' : 'DIFF'} ${line}`);
    if (!same) problems.push(`${row.id}${scope.label}: v3 result differs from old`);
  }
}

async function main() {
  if (scratchArg) {
    for (const fixture of fixtures) await runRows(fixture);
  }
  problems.forEach((problem) => console.log(problem));
  console.log(problems.length ? `FAIL (${problems.length})` : 'OK');
  process.exit(problems.length ? 1 : 0);
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
