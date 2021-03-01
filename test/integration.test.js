/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('../lib/generator');
const dummySpecPath = path.resolve(__dirname, './docs/dummy.yml');
const mainTestResultPath = 'test/temp/integrationTestResult';
//we do not want to download chromium for html-template if it is not needed
process.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] = true;

describe('Integration testing generateFromFile() to make sure the result of the generation is not changend comparing to snapshot', () => {
  jest.setTimeout(30000);

  it('generated using Nunjucks template', async () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve(mainTestResultPath, Math.random().toString(36).substring(7));

    const generator = new Generator('@asyncapi/html-template@0.18.0', outputDir, { forceWrite: true, templateParams: { singleFile: true } });
    await generator.generateFromFile(dummySpecPath);    
    const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('generate using React template', async () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve(mainTestResultPath, Math.random().toString(36).substring(7));

    const generator = new Generator('@asyncapi/markdown-template@0.13.0', outputDir, { forceWrite: true });
    await generator.generateFromFile(dummySpecPath);    
    const file = await readFile(path.join(outputDir, 'asyncapi.md'), 'utf8');
    expect(file).toMatchSnapshot();
  });
});