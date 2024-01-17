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
    const generator = new Generator('@asyncapi/html-template', outputDir,
      { 
        debug: true,
        install: true, 
        forceWrite: true, 
        templateParams: { 
          singleFile: true 
        },
        registry: {
          url: 'http://127.0.0.1:4873',  // Replace the host.docker.internal to localhost for testing without docker
          auth: 'YWRtaW46bmltZGE='  // base64 encoded username and password represented as admin:nimda
          
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