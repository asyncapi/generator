// Usage: node .claude/skills/bake-in-template/scripts/generate.js <templateName> <outputDir> <asyncapiFile> <paramsFile>  (run from the repo root)
const fs = require('fs');
const path = require('path');
const Generator = require(path.resolve('apps/generator'));

const [templateName, outputDir, asyncapiFile, paramsFile] = process.argv.slice(2);
const templateParams = JSON.parse(fs.readFileSync(paramsFile, 'utf8'));

async function main() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  // Passing the baked-in name (not a path) makes the generator use the built bakedInTemplates/ copy.
  const generator = new Generator(templateName, path.resolve(outputDir), { forceWrite: true, templateParams });
  await generator.generateFromFile(path.resolve(asyncapiFile));
  console.log(`generated ${outputDir}`);
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
