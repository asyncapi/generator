// Usage: node .claude/skills/bake-in-template/scripts/capture.js <SCRATCH_DIR> <fixture> <paramsFile>  (run from the repo root) → one JSON run object on stdout
const fs = require('fs');
const path = require('path');

const [scratchArg, fixture, paramsFile] = process.argv.slice(2);
const scratchDir = path.resolve(scratchArg);
// The OLD generator, installed under oldgen/ in Wave 0. Not the repo's generator.
const OldGenerator = require(path.join(scratchDir, 'oldgen', 'node_modules', '@asyncapi', 'generator'));
const fixtureName = path.parse(fixture).name; // "asyncapi" for "test/fixtures/asyncapi.yml"
const outputDir = path.join(scratchDir, 'golden', fixtureName);
const templateParams = JSON.parse(fs.readFileSync(paramsFile, 'utf8'));

function listFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function toScratchRelative(filePath) {
  return path.relative(scratchDir, filePath).split(path.sep).join('/');
}

async function main() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  const generator = new OldGenerator(path.join(scratchDir, 'source'), outputDir, { forceWrite: true, templateParams });
  await generator.generateFromFile(path.resolve(fixture));

  const files = listFiles(outputDir).map(toScratchRelative);
  console.log(JSON.stringify({ fixture, params: templateParams, outputDir: toScratchRelative(outputDir), files }));
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
