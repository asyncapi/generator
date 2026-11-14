// Usage: node .claude/skills/bake-in-template/scripts/import-gate.js <TARGET_PATH> [<helper file>...]  (run from the repo root)
// Exit 0: every generation-time import is a Node builtin, a relative path or a GENERATOR_DEPS package, and every
// import in a <helper file> (a new or changed packages/helpers/src file) is a Node builtin, a relative path or a
// packages/helpers dependency, because the published @asyncapi/generator-helpers ships only those. A helper file is
// checked only for packages its HEAD version didn't already import: the run answers only for imports it added.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { builtinModules } = require('module');
const { parse } = require('@babel/parser');

const templateDir = path.resolve(process.argv[2]);
// Two shared-helper rows can share one module, so the same path can be passed twice.
const helperFiles = [...new Set(process.argv.slice(3).map((filePath) => path.resolve(filePath)))];
const generatorDeps = Object.keys(require(path.resolve('apps/generator/package.json')).dependencies);
const helpersDeps = Object.keys(require(path.resolve('packages/helpers/package.json')).dependencies || {});

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '__transpiled') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function filesToCheck() {
  return ['template', 'components', 'hooks']
    .flatMap((folder) => listFiles(path.join(templateDir, folder)))
    // Why: the generator renders only .js, .jsx and .cjs (apps/generator/lib/utils.js isJsFile) and copies .mjs raw,
    // so a .mjs file is generated-project code, not template code.
    .filter((filePath) => /\.(js|jsx|cjs)$/.test(filePath))
    .concat(helperFiles);
}

// `import x from 'a'`, `export … from 'a'` and `export * from 'a'`.
function isImportOrExportFrom(node) {
  const declarationTypes = ['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'];
  return declarationTypes.includes(node.type) && Boolean(node.source);
}

// `require('a')` and `import('a')` with a string literal argument.
function isRequireOrDynamicImport(node) {
  if (node.type !== 'CallExpression') return false;
  const firstArgument = node.arguments[0];
  if (!firstArgument || firstArgument.type !== 'StringLiteral') return false;
  const isRequire = node.callee.type === 'Identifier' && node.callee.name === 'require';
  const isDynamicImport = node.callee.type === 'Import';
  return isRequire || isDynamicImport;
}

// Walks the whole AST and collects every imported module specifier.
function collectSpecifiers(node, specifiers = []) {
  if (!node || typeof node.type !== 'string') return specifiers;
  if (isImportOrExportFrom(node)) specifiers.push(node.source.value);
  if (isRequireOrDynamicImport(node)) specifiers.push(node.arguments[0].value);

  for (const [key, value] of Object.entries(node)) {
    if (key === 'loc') continue;
    const children = Array.isArray(value) ? value : [value];
    for (const child of children) {
      if (child && typeof child === 'object') collectSpecifiers(child, specifiers);
    }
  }
  return specifiers;
}

// The package a specifier belongs to: "node:fs/promises" → "fs", "@asyncapi/parser/cjs" → "@asyncapi/parser", "lodash/fp" → "lodash".
function packageNameOf(specifier) {
  const bare = specifier.replace(/^node:/, '');
  const parts = bare.split('/');
  return bare.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
}

function parseCode(text) {
  return parse(text, { sourceType: 'unambiguous', plugins: ['jsx'] });
}

// The packages a file imported at HEAD. An existing helpers module may already import a package that isn't a
// packages/helpers dependency, which the run didn't write and can't fix.
function packagesAtHead(repoRelativePath) {
  try {
    const text = execFileSync('git', ['show', `HEAD:${repoRelativePath}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return collectSpecifiers(parseCode(text).program).map(packageNameOf);
  } catch (error) {
    // A new file has no HEAD version, so every import in it is checked.
    return [];
  }
}

const files = filesToCheck();
const violations = [];
for (const filePath of files) {
  const displayPath = path.relative(process.cwd(), filePath).split(path.sep).join('/');
  let ast;
  try {
    ast = parseCode(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    violations.push({ file: displayPath, specifier: null, reason: `parse error: ${error.message}` });
    continue;
  }

  const allowedDeps = helperFiles.includes(filePath) ? helpersDeps.concat(packagesAtHead(displayPath)) : generatorDeps;
  for (const specifier of collectSpecifiers(ast.program)) {
    const isRelative = specifier.startsWith('.') || specifier.startsWith('/');
    if (isRelative) continue;
    const packageName = packageNameOf(specifier);
    if (builtinModules.includes(packageName) || allowedDeps.includes(packageName)) continue;
    violations.push({ file: displayPath, specifier, package: packageName });
  }
}

console.log(JSON.stringify({ checked: files.length, violations }, null, 2));
process.exit(violations.length ? 1 : 0);
