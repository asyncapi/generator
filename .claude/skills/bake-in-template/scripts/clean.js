// Usage (run from the repo root):
//   node .claude/skills/bake-in-template/scripts/clean.js <path>...                 deletes each path
//   node .claude/skills/bake-in-template/scripts/clean.js --keep <dir> <name>...    deletes everything in <dir> except the named entries
//   node .claude/skills/bake-in-template/scripts/clean.js --test-output <TARGET_PATH>  deletes <TARGET_PATH>/test/temp (gitignored test output)
// The first two forms delete only under temp/bake-in-template/, and refuse anything else. --test-output deletes
// only a test/temp folder under packages/templates/.
// Prints each deleted path, and `missing:` for a path that doesn't exist (e.g. an unexpanded glob); exits 1 if any
// delete failed.
const fs = require('fs');
const path = require('path');

let allowedRoot = path.resolve('temp/bake-in-template');
let allowedRootName = 'temp/bake-in-template/';

function isInsideAllowedRoot(target) {
  const relative = path.relative(allowedRoot, target);
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function remove(target) {
  const absolute = path.resolve(target);
  if (!isInsideAllowedRoot(absolute)) {
    console.error(`refused: ${target} is not inside ${allowedRootName}`);
    return false;
  }
  if (!fs.existsSync(absolute)) {
    // Not a failure, but say so: an unexpanded glob would otherwise look like a successful delete.
    console.log(`missing: ${target}`);
    return true;
  }
  try {
    // `force` ignores a missing path. Node clears the read-only flag that Windows sets on .git pack files,
    // and `maxRetries` waits out a file a just-stopped process still holds (EBUSY, EPERM).
    fs.rmSync(absolute, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
    console.log(`deleted ${target}`);
    return true;
  } catch (error) {
    console.error(`failed: ${target}: ${error.message}`);
    return false;
  }
}

const args = process.argv.slice(2);
let targets = args;

if (args[0] === '--keep') {
  const [, dir, ...keep] = args;
  const entries = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  targets = entries
    .filter((name) => !keep.includes(name))
    .map((name) => path.join(dir, name));
} else if (args[0] === '--test-output') {
  targets = [path.join(args[1], 'test', 'temp')];
  allowedRoot = path.resolve('packages/templates');
  allowedRootName = 'packages/templates/';
}

let failed = false;
for (const target of targets) {
  if (!remove(target)) {
    failed = true;
  }
}
process.exit(failed ? 1 : 0);
