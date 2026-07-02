const path = require('path');
const { mkdir, writeFile } = require('fs').promises;

async function createAsyncapiFile(generator) {
  const asyncapi = generator.originalAsyncAPI;
  const targetDir = generator.targetDir;
  const customDirInTarget = generator.templateParams && generator.templateParams.asyncapiFileDir;
  let extension;

  try {
    JSON.parse(asyncapi);
    extension = 'json';
  } catch (e) {
    extension = 'yaml';
  }

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
