const fs = require('fs');
const path = require('path');
const xfs = require('fs.extra');

function createAsyncapiFile(generator) {
  const asyncapi = generator.originalAsyncAPI;
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

  fs.writeFileSync(asyncapiOutputLocation, asyncapi);
}

module.exports = {
  'generate:after': createAsyncapiFile
};