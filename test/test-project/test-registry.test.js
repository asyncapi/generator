/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('../lib/generator');
const dummySpecPath = path.resolve(__dirname, './docs/dummy.yml');
const crypto = require('crypto');
const mainTestResultPath = 'test/temp/integrationTestResult';
//we do not want to download chromium for html-template if it is not needed
process.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] = true;

describe('Integration testing generateFromFile() to make sure the result of the generation is not changend comparing to snapshot', () => {
  const generateFolderName = () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(60000);

  it('generated using private registory', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator('@asyncapi/html-template', outputDir, 
      { forceWrite: true, templateParams: { singleFile: true }, 
        registry: {url: 'http://localhost:4873/', username: 'admin', password: 'nimbda'}});
    await generator.generateFromFile(dummySpecPath);
    const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(file).toMatchSnapshot();
  });
});
