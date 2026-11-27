// Usage: node .claude/skills/bake-in-template/scripts/component-tests.js <TARGET_PATH>  (run from the repo root)
// Prints {"needTest":[…],"missing":[…]} as JSON. `needTest` lists the files under <TARGET_PATH>/components/ whose code
// branches or loops. Each one needs the test <TARGET_PATH>/test/components/<base>.test.js, where <base> is its file
// name up to the first dot. `missing` lists the ones that don't have it. Exit 1 when `missing` isn't empty.
const fs = require('fs');
const path = require('path');
const { hasReactLogic } = require('./has-logic');

const templateDir = path.resolve(process.argv[2]);

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const needTest = [];
const missing = [];
for (const filePath of listFiles(path.join(templateDir, 'components'))) {
  const isCode = ['.js', '.jsx', '.cjs'].includes(path.extname(filePath));
  if (!isCode || !hasReactLogic(fs.readFileSync(filePath, 'utf8'))) continue;

  const displayPath = path.relative(process.cwd(), filePath).split(path.sep).join('/');
  const base = path.basename(filePath).split('.')[0];
  needTest.push(displayPath);
  if (!fs.existsSync(path.join(templateDir, 'test', 'components', `${base}.test.js`))) missing.push(displayPath);
}

console.log(JSON.stringify({ needTest, missing }, null, 2));
process.exit(missing.length ? 1 : 0);
