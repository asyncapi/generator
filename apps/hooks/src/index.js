const fs = require('fs');
const path = require('path');
const xfs = require('fs.extra');
const bundle = require('@asyncapi/bundler');

async function createAsyncapiFile(generator) {
  const sourceFilePath = typeof generator.asyncapi?.meta === 'function'
    ? generator.asyncapi.meta('asyncapi')?.source
    : undefined;
  let asyncapi = generator.originalAsyncAPI;
  const targetDir = generator.targetDir;
  const customDirInTarget = generator.templateParams.asyncapiFileDir;
  const getCustomFileLocation = (target, dir, filename) => {
    xfs.mkdirpSync(path.resolve(target, dir));
    return path.resolve(target, dir, filename);
  };
  let extension;

  try {
    JSON.parse(asyncapi);
    extension = 'json';
  } catch (e) {
    extension = 'yaml';
  }

  const outputFileName = `asyncapi.${extension}`;
  
  const asyncapiOutputLocation = customDirInTarget
    ? getCustomFileLocation(targetDir, customDirInTarget, outputFileName)
    : path.resolve(targetDir, outputFileName);

  if (sourceFilePath && fs.existsSync(sourceFilePath)) {
    try {
      const bundled = await bundle([sourceFilePath], {
        baseDir: path.dirname(sourceFilePath)
      });
      asyncapi = extension === 'json' ? bundled.string() : bundled.yml();
    } catch (err) {
      console.warn(`[generator-hooks] Failed to bundle AsyncAPI document, writing original source verbatim: ${err.message}`);
    }
  }

  fs.writeFileSync(asyncapiOutputLocation, asyncapi);
}

module.exports = {
  'generate:after': createAsyncapiFile
};