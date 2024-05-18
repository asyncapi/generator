/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('../lib/generator');
const dummySpecPath = path.resolve(__dirname, './docs/dummy.yml');
const refSpecPath = path.resolve(__dirname, './docs/apiwithref.json');
const refSpecFolder = path.resolve(__dirname, './docs/');
const crypto = require('crypto');
const mainTestResultPath = 'test/temp/integrationTestResult';
const reactTemplate = 'test/test-templates/react-template';
const nunjucksTemplate = 'test/test-templates/nunjucks-template';

describe('Integration testing generateFromFile() to make sure the result of the generation is not changend comparing to snapshot', () => {
  const generateFolderName = () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(60000);
  const testOutputFile = 'test-file.md';

  it('generated using Nunjucks template', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(nunjucksTemplate, outputDir, { 
      forceWrite: true,
      templateParams: { version: 'v1', mode: 'production' }
    });
    await generator.generateFromFile(dummySpecPath);
    const file = await readFile(path.join(outputDir, testOutputFile), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('generate using React template', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, { 
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production' }
    });
    await generator.generateFromFile(dummySpecPath);
    const file = await readFile(path.join(outputDir, testOutputFile), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('generate json based api with referenced JSON Schema', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      mapBaseUrlToFolder: { url: 'https://schema.example.com/crm/', folder: `${refSpecFolder}/`},
      forceWrite: true,
      templateParams: { version: 'v1', mode: 'production' }
    });
    await generator.generateFromFile(refSpecPath);
    const file = await readFile(path.join(outputDir, testOutputFile), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('generates without transpilation when compile flag is false', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator('@asyncapi/html-template@2.3.0', outputDir, {
      forceWrite: true,
      compile: false,
      debug: true,
    });
  
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
    await generator.generateFromFile(dummySpecPath);
  
    expect(logSpy.mock.calls.some(call => call.some(arg => arg === 'Babel'))).toBe(true);
  
    logSpy.mockRestore();
  });

  it('generates with transpilation when compile flag is true', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator('@asyncapi/html-template@2.3.0', outputDir, {
      forceWrite: true,
      compile: true,
      debug: true,
    });
  
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  
    await generator.generateFromFile(dummySpecPath);
  
    expect(logSpy.mock.calls.some(call => call.some(arg => arg === 'Babel'))).toBe(false);
  
    logSpy.mockRestore();
  });
});
