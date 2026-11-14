// Usage (from the repo root):
//   node .claude/skills/bake-in-template/scripts/scan.js <SCRATCH_DIR> <ENGINE>
//
// <ENGINE> is nunjucks or react, as Wave 0 step 3 decided it. The config alone can't tell
// when `renderer` isn't set, so the scan never guesses it.
//
// It takes the scratch folder, not just source/, because it uses four places inside it:
//   reads  <SCRATCH_DIR>/source/             the cloned old template (Wave 0 step 1)
//   reads  <SCRATCH_DIR>/oldgen/             the old generator, for the Nunjucks built-in filter names (step 4)
//   writes <SCRATCH_DIR>/fixtures/           fixtures downloaded from a URL
//   writes <SCRATCH_DIR>/source-index.json   the result
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { parse } = require('@babel/parser');

const scratchDir = path.resolve(process.argv[2]);
const sourceDir = path.join(scratchDir, 'source');
const engine = process.argv[3];
if (engine !== 'nunjucks' && engine !== 'react') {
  console.error('Usage: node scan.js <SCRATCH_DIR> <nunjucks|react>');
  process.exit(1);
}

// Source folder → the `origin` recorded for its files.
const ORIGIN_BY_FOLDER = {
  template: 'template',
  filters: 'filter',
  hooks: 'hook',
  components: 'component',
  helpers: 'helper',
  partials: 'partial',
};

// A declared protocol → the protocol folder under packages/templates/<type>/.
// A protocol not listed here uses its own name, lowercased.
const PROTOCOL_ALIASES = {
  ws: 'websocket',
  wss: 'websocket',
  'kafka-secure': 'kafka',
  mqtts: 'mqtt',
  'secure-mqtt': 'mqtt',
  amqps: 'amqp',
  https: 'http',
};

// Config keys that have a fixed mapping. Every other key goes to `otherConfigKeys`.
const KNOWN_CONFIG_KEYS = ['parameters', 'hooks', 'filters', 'renderer', 'apiVersion', 'generator', 'supportedProtocols'];

// A whole Nunjucks tag.
// Matches: "{{ name | upper }}" and "{% if x %}"
const NUNJUCKS_TAG = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}/g;

// A filter name after a single pipe. "||" (JS "or") is not a filter.
// Matches: "kebabCase" in "{{ name | kebabCase }}"
const FILTER_USE = /(?<!\|)\|(?!\|)\s*([A-Za-z_]\w*)/g;

// The file path in an include, import, from or extends tag.
// Matches: "partials/usage.md" in "{% include 'partials/usage.md' %}"
const INCLUDE_TAG = /\{%-?\s*(?:include|import|extends|from)\s+['"]([^'"]+)['"]/g;

// A word followed by one or more ".method(…)" calls.
// Matches: "channel.subscribe().id()" → receiver "channel", methods ".subscribe().id()"
const METHOD_CHAIN = /\b([A-Za-z_$][\w$]*)((?:\.[A-Za-z_$][\w$]*\((?:[^()]|\([^()]*\))*\))+)/g;

// A Nunjucks if or for tag.
// Matches: "{% if" and "{%- for"
const NUNJUCKS_CONDITIONAL = /\{%-?\s*(if|for)\b/;

// A quoted .yml, .yaml or .json path or URL in a test file.
// Matches: "./docs/dummy.yml" in "path.resolve(__dirname, './docs/dummy.yml')"
const FIXTURE_PATH = /['"`]([^'"`\s]+\.(?:ya?ml|json))['"`]/g;

// The value after "templateParams:": an object literal or a variable name.
// Matches: "{ server: 'dev' }" in "templateParams: { server: 'dev' }", and "params" in "templateParams: params"
const TEMPLATE_PARAMS = /templateParams\s*:\s*(\{[^}]*\}|[A-Za-z_$][\w$]*)/g;

// An export assignment, read from the text when a filter or hook file can't be required.
// Matches: "kebabCase" in "filter.kebabCase = …", "module.exports.kebabCase = …" and "exports.kebabCase = …"
const EXPORT_ASSIGNMENT = /(?:filter|module\.exports|exports)\.([A-Za-z_$][\w$]*)\s*=/g;

// A URL to a file of this repo. Captures the path after the branch name.
// Matches: "apps/generator/test/docs/ws.yml" in
//   "https://raw.githubusercontent.com/asyncapi/generator/master/apps/generator/test/docs/ws.yml"
const REPO_FILE_URL = /^https:\/\/raw\.githubusercontent\.com\/asyncapi\/generator\/[^/]+\/(.+)$/;

// Things the scan looked for but couldn't find. Printed at the end and kept in the index.
const missing = [];

// ---------- Config ----------

function readConfig() {
  // .ageneratorrc wins over package.json "generator".
  const rcFile = path.join(sourceDir, '.ageneratorrc');
  // An empty or comment-only .ageneratorrc loads as undefined.
  if (fs.existsSync(rcFile)) return yaml.load(fs.readFileSync(rcFile, 'utf8')) || {};
  const packageJson = JSON.parse(fs.readFileSync(path.join(sourceDir, 'package.json'), 'utf8'));
  return packageJson.generator || {};
}

const config = readConfig();

function detectProtocol() {
  const declared = Array.isArray(config.supportedProtocols) ? config.supportedProtocols[0] : null;
  if (!declared) return null;
  const name = String(declared).toLowerCase();
  return PROTOCOL_ALIASES[name] || name;
}

// ---------- File helpers ----------

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function toSourceRelative(filePath) {
  return path.relative(sourceDir, filePath).split(path.sep).join('/');
}

function toRepoRelative(filePath) {
  return path.relative(process.cwd(), filePath).split(path.sep).join('/');
}

function isJsFile(filePath) {
  return /\.(js|jsx|cjs|mjs)$/.test(filePath);
}

function hasNunjucksSyntax(text) {
  // `{#` opens a Nunjucks comment, which the old generator stripped from the output.
  return text.includes('{{') || text.includes('{%') || text.includes('{#');
}

// ---------- One file ----------

function detectKind(relativePath, text, origin) {
  const isTemplateFile = origin === 'template' || origin === 'partial';
  if (!isTemplateFile) return 'js';
  // Why: the React engine renders only .js, .jsx and .cjs (apps/generator/lib/utils.js isJsFile); .mjs is copied raw.
  if (engine === 'react') return /\.(js|jsx|cjs)$/.test(relativePath) ? 'react' : 'static';
  return hasNunjucksSyntax(text) ? 'dynamic' : 'static';
}

function exportedNames(filePath) {
  try {
    return Object.keys(require(filePath));
  } catch (error) {
    // The file needs a package that isn't installed, so read its export assignments instead.
    const text = fs.readFileSync(filePath, 'utf8');
    const names = [...text.matchAll(EXPORT_ASSIGNMENT)].map((match) => match[1]);
    if (names.length === 0) {
      missing.push(`exports of ${toSourceRelative(filePath)} (${error.message.split('\n')[0]})`);
    }
    return names;
  }
}

function findParserCalls(text, kind) {
  const calls = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    // Nunjucks files: only lines with a tag. JS and React files: every line.
    if (kind === 'static') return;
    if (kind === 'dynamic' && !hasNunjucksSyntax(line)) return;

    for (const match of line.matchAll(METHOD_CHAIN)) {
      const [chain, receiver, methods] = match;
      const method = methods.slice(1, methods.indexOf('('));
      calls.push({ line: index + 1, receiver, method, chain });
    }
  });
  return calls;
}

// Whether this syntax tree branches: if, switch, a ternary, &&, a loop, or a .map() / .forEach() loop.
// `||` and `??` don't count, because they only set a default value.
const LOGIC_NODES = [
  'IfStatement', 'SwitchStatement', 'ConditionalExpression',
  'ForStatement', 'ForOfStatement', 'ForInStatement', 'WhileStatement', 'DoWhileStatement',
];
const LOOP_METHODS = ['map', 'forEach'];

function nodeHasLogic(node) {
  if (!node || typeof node.type !== 'string') return false;
  if (LOGIC_NODES.includes(node.type)) return true;
  if (node.type === 'LogicalExpression' && node.operator === '&&') return true;
  // `items?.map(...)` parses as OptionalCallExpression over OptionalMemberExpression.
  const isMemberCall = ['CallExpression', 'OptionalCallExpression'].includes(node.type) &&
    ['MemberExpression', 'OptionalMemberExpression'].includes(node.callee.type);
  if (isMemberCall && LOOP_METHODS.includes(node.callee.property.name)) return true;

  return Object.entries(node).some(([key, value]) => {
    if (key === 'loc') return false;
    const children = Array.isArray(value) ? value : [value];
    return children.some((child) => child && typeof child === 'object' && nodeHasLogic(child));
  });
}

// Reads the syntax tree, not the text, so "if (" or ".map(" inside generated-code strings doesn't count.
function hasReactLogic(text) {
  try {
    return nodeHasLogic(parse(text, { sourceType: 'unambiguous', plugins: ['jsx'] }).program);
  } catch (error) {
    return true; // It can't be parsed, so we can't tell: ask for a test.
  }
}

function detectConditionals(relativePath, text, kind, origin) {
  if (NUNJUCKS_CONDITIONAL.test(text)) return true;
  const isReactCode = (kind === 'react' || origin === 'component') && isJsFile(relativePath);
  return isReactCode && hasReactLogic(text);
}

function describeFile(filePath, origin) {
  const relativePath = toSourceRelative(filePath);
  const buffer = fs.readFileSync(filePath);
  const isBinary = buffer.includes(0);
  const text = isBinary ? '' : buffer.toString('utf8');
  const kind = isBinary ? 'binary' : detectKind(relativePath, text, origin);

  // Filters and includes count only inside Nunjucks tags, so Markdown tables and shell pipes are ignored.
  const tagText = kind === 'dynamic' ? (text.match(NUNJUCKS_TAG) || []).join('\n') : '';
  const filters = [...tagText.matchAll(FILTER_USE)].map((match) => match[1]);
  const includes = [...tagText.matchAll(INCLUDE_TAG)].map((match) => match[1]);
  const exportsSomething = (origin === 'filter' || origin === 'hook') && isJsFile(relativePath);

  return {
    path: relativePath,
    origin,
    kind,
    filenameTemplated: engine === 'nunjucks' && relativePath.includes('$$'),
    hasConditionals: detectConditionals(relativePath, text, kind, origin),
    filters: [...new Set(filters)],
    includes,
    parserCalls: isBinary ? [] : findParserCalls(text, kind),
    definesFilters: exportsSomething && origin === 'filter' ? exportedNames(filePath) : [],
    definesHooks: exportsSomething && origin === 'hook' ? exportedNames(filePath) : [],
  };
}

// ---------- All files, following includes ----------

function findIncludedFile(includePath, includingFile) {
  // Where Nunjucks looks: template/, partials/, the source root, then next to the including file.
  const candidates = [
    path.join(sourceDir, 'template', includePath),
    path.join(sourceDir, 'partials', includePath),
    path.join(sourceDir, includePath),
    path.join(path.dirname(includingFile), includePath),
  ];
  const direct = candidates.find((candidate) => fs.existsSync(candidate));
  if (direct) return direct;

  // Anywhere else in the source, matched by the end of its path.
  const wanted = '/' + includePath.replace(/^\.?\//, '');
  return listFiles(sourceDir).find((filePath) => ('/' + toSourceRelative(filePath)).endsWith(wanted));
}

function scanSourceFiles() {
  const queue = [];
  for (const [folder, origin] of Object.entries(ORIGIN_BY_FOLDER)) {
    for (const filePath of listFiles(path.join(sourceDir, folder))) {
      queue.push({ filePath, origin });
    }
  }

  const filesByPath = new Map();
  while (queue.length > 0) {
    const { filePath, origin } = queue.shift();
    const relativePath = toSourceRelative(filePath);
    if (filesByPath.has(relativePath)) continue;

    const file = describeFile(filePath, origin);
    filesByPath.set(relativePath, file);

    for (const includePath of file.includes) {
      const includedFile = findIncludedFile(includePath, filePath);
      if (!includedFile) {
        missing.push(`include '${includePath}' in ${relativePath}`);
        continue;
      }
      const topFolder = toSourceRelative(includedFile).split('/')[0];
      queue.push({ filePath: includedFile, origin: ORIGIN_BY_FOLDER[topFolder] || 'partial' });
    }
  }
  return [...filesByPath.values()];
}

// ---------- Filters: local, built-in or from a package ----------

function nunjucksBuiltinFilterNames() {
  // Read from the old generator's own Nunjucks, installed under oldgen/ in Wave 0 step 4.
  try {
    const oldGenerator = path.join(scratchDir, 'oldgen', 'node_modules', '@asyncapi', 'generator');
    const filtersFile = require.resolve('nunjucks/src/filters.js', { paths: [oldGenerator] });
    return Object.keys(require(filtersFile));
  } catch (error) {
    return [];
  }
}

function splitUsedFilters(files) {
  const used = new Set(files.flatMap((file) => file.filters));
  const definedLocally = new Set(files.flatMap((file) => file.definesFilters));
  const builtinNames = nunjucksBuiltinFilterNames();

  const builtinFilters = [];
  const externalFilters = [];
  for (const name of used) {
    if (definedLocally.has(name)) continue;
    if (builtinNames.includes(name)) {
      builtinFilters.push(name);
    } else {
      externalFilters.push(name);
    }
  }
  return { builtinFilters, externalFilters };
}

// ---------- Tests: fixtures and template parameters ----------

async function resolveFixture(fixture, testFile) {
  if (!(/^https?:\/\//).test(fixture)) {
    // A local path, relative to the test file or to the source root.
    const candidates = [path.resolve(path.dirname(testFile), fixture), path.resolve(sourceDir, fixture)];
    const found = candidates.find((candidate) => fs.existsSync(candidate));
    return found ? toRepoRelative(found) : null;
  }

  // A URL to a file of this repo: use the repo file.
  const repoFile = fixture.match(REPO_FILE_URL);
  if (repoFile && fs.existsSync(repoFile[1])) return repoFile[1];

  // Any other URL: download it once.
  const target = path.join(scratchDir, 'fixtures', path.basename(fixture));
  if (!fs.existsSync(target)) {
    const response = await fetch(fixture).catch(() => null);
    if (!response || !response.ok) return null;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, await response.text());
  }
  return toRepoRelative(target);
}

function findTemplateParams(text) {
  const params = [];
  for (const match of text.matchAll(TEMPLATE_PARAMS)) {
    const value = match[1];
    if (value.startsWith('{')) {
      params.push(value);
      continue;
    }
    // A variable: find "const <name> = { … }" in the same file.
    const declaration = new RegExp(`(?:const|let|var)\\s+${value.replace(/\$/g, '\\$')}\\s*=\\s*(\\{[^}]*\\})`);
    const found = text.match(declaration);
    if (found) {
      params.push(found[1]);
    } else {
      missing.push(`templateParams variable '${value}'`);
    }
  }
  return params;
}

async function scanTests() {
  const testFiles = listFiles(path.join(sourceDir, 'test')).filter(isJsFile);
  const testFixtures = new Set();
  const testParams = [];

  for (const testFile of testFiles) {
    const text = fs.readFileSync(testFile, 'utf8');
    const file = toSourceRelative(testFile);

    for (const match of text.matchAll(FIXTURE_PATH)) {
      const fixture = match[1];
      if (fixture.endsWith('package.json')) continue;
      const localPath = await resolveFixture(fixture, testFile);
      if (localPath) {
        testFixtures.add(localPath);
      } else {
        missing.push(`fixture '${fixture}' in ${file}`);
      }
    }

    for (const paramsText of findTemplateParams(text)) {
      testParams.push({ file, text: paramsText });
    }
  }
  return { testFixtures: [...testFixtures], testParams };
}

// ---------- Write the index ----------

async function main() {
  const files = scanSourceFiles();
  const { builtinFilters, externalFilters } = splitUsedFilters(files);
  const { testFixtures, testParams } = await scanTests();

  const otherConfigKeys = {};
  for (const [key, value] of Object.entries(config)) {
    if (!KNOWN_CONFIG_KEYS.includes(key)) otherConfigKeys[key] = value;
  }

  const index = {
    engine,
    config,
    apiVersion: config.apiVersion || 'none',
    detectedProtocol: detectProtocol(),
    files,
    builtinFilters,
    externalFilters,
    otherConfigKeys,
    testFixtures,
    testParams,
    missing,
  };
  fs.writeFileSync(path.join(scratchDir, 'source-index.json'), JSON.stringify(index, null, 2));

  const summary = [
    `files=${files.length}`,
    `engine=${engine}`,
    `apiVersion=${index.apiVersion}`,
    `protocols=${config.supportedProtocols || 'none'}`,
    `detectedProtocol=${index.detectedProtocol}`,
    `builtin=${builtinFilters}`,
    `external=${externalFilters}`,
    `fixtures=${testFixtures}`,
    `params=${testParams.length}`,
  ];
  console.log(summary.join(' '));
  for (const item of missing) console.log(`missing: ${item}`);
}

main();
