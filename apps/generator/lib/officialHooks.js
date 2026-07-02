const path = require('node:path');
const { mkdir, writeFile } = require('node:fs').promises;

async function createAsyncapiFile(generator) {
  const asyncapi = generator.originalAsyncAPI;
  const targetDir = generator.targetDir;
  const customDirInTarget = generator.templateParams?.asyncapiFileDir;
  const extension = asyncapi.trimStart().startsWith('{') ? 'json' : 'yaml';

  const outputFileName = `asyncapi.${extension}`;
  const outputDir = customDirInTarget
    ? path.resolve(targetDir, customDirInTarget)
    : targetDir;

  if (customDirInTarget) {
    await mkdir(outputDir, { recursive: true });
  }

  await writeFile(path.resolve(outputDir, outputFileName), asyncapi);
}

module.exports = {
  'generate:after': createAsyncapiFile
};
