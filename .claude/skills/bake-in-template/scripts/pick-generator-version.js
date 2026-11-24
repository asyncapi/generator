// Usage: node .claude/skills/bake-in-template/scripts/pick-generator-version.js <versionsJsonFile> <range> <engine>
// Prints the highest published @asyncapi/generator version that satisfies <range>.
const fs = require('fs');
const semver = require('semver');

const [versionsFile, range, engine] = process.argv.slice(2);
let versions = JSON.parse(fs.readFileSync(versionsFile, 'utf8'));

// Generator 3.0.0 removed Nunjucks, so a Nunjucks template can only be captured with 2.x.
if (engine === 'nunjucks') {
  versions = versions.filter((version) => semver.lt(version, '3.0.0'));
}

const picked = semver.maxSatisfying(versions, range);
if (!picked) {
  console.error(`No published @asyncapi/generator version satisfies "${range}" (engine: ${engine}).`);
  process.exit(1);
}
console.log(picked);
