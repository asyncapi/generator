/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve(__dirname, '../docs/dummy.yml');
const crypto = require('crypto');
const mainTestResultPath = 'test/temp/integrationTestResult';
process.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] = true;

describe('Integration testing generateFromFile() to make sure the template can be download from the private repository.', () => {
  const generateFolderName = () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(6000000);

  it('generated using private registory', async () => {
    const outputDir = generateFolderName();
    const extraAuth = {
      '//localhost:4873/:_auth': 'YWRtaW46bmltZGE='   // Replace the host.docker.internal to localhost for testing without docker
    };
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
    try {
      await generator.generateFromFile(dummySpecPath);
      // Code to run if the method call is successful
    } catch (error) {
      // Code to handle the error
      console.error('An error occurred:', error);
    }
      
    const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(file).toContain('Dummy example with all spec features included');
  });
});
