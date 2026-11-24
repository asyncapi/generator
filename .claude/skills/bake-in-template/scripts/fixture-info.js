// Usage: node .claude/skills/bake-in-template/scripts/fixture-info.js <asyncapiFile>...  → one JSON line per file
// Parses like the generator does for apiVersion v3 templates (schema parsers included, e.g. Avro).
const fs = require('fs');
const path = require('path');
const { NewParser } = require('@asyncapi/multi-parser');

const ERROR_SEVERITY = 0;
const parser = NewParser(3, { includeSchemaParsers: true });

async function describeDocument(file) {
  const { document, diagnostics } = await parser.parse(fs.readFileSync(file, 'utf8'), { source: path.resolve(file) });
  if (!document) {
    const errors = diagnostics.filter((diagnostic) => diagnostic.severity === ERROR_SEVERITY).map((diagnostic) => diagnostic.message);
    return { file, error: errors };
  }
  const operations = document.operations();
  return {
    file,
    version: document.version(),
    title: document.info().title(),
    send: operations.filterBySend().length,
    receive: operations.filterByReceive().length,
    servers: document.servers().all().map((server) => server.id()),
  };
}

async function main() {
  let failed = false;
  for (const file of process.argv.slice(2)) {
    // A wrong path or a parser exception is reported for that file only, so the rest of the batch still prints.
    let info;
    try {
      info = await describeDocument(file);
    } catch (error) {
      info = { file, error: [error.message] };
    }
    if (info.error) failed = true;
    console.log(JSON.stringify(info));
  }
  process.exit(failed ? 1 : 0);
}

main();
