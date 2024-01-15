/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve('/Users/aaayush/Desktop/generator/test/docs/dummy.yml');
const crypto = require('crypto');
const mainTestResultPath = 'test/temp/integrationTestResult';

const generateFolderName = () => {
  //you always want to generate to new directory to make sure test runs in clear environment
  return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
};

const extraAuth = {
  '//localhost:4873/:_auth': 'YWRtaW46bmltZGE='
};
async function print() {
  const outputDir = generateFolderName();
  const generator = new Generator('@asyncapi/html-template', outputDir,
    { 
      debug: true,
      install: true, 
      forceWrite: true, 
      templateParams: { 
        singleFile: true 
      },
      registry: {
        url: 'http://localhost:4873',  // Replace the host.docker.internal to localhost for testing without docker
        extraAuth // YWRtaW46bmltZGE= is encoded with base64 username and password -> admin:nimda
      }
    });
  await generator.generateFromFile(dummySpecPath);
  const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');

  console.log(file);
};

print();