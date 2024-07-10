/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const { promises: fsPromise } = require('fs');
const { readFileSync} = require('fs');
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
  const tempOutputFile = 'temp.md';

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

  it('check if the temp.md file is created with compile option true', async () => {
    const logSpyDebug = jest.spyOn(console, 'log').mockImplementation(() => {});
    // log.debug = jest.fn();

    const outputDir = generateFolderName();
    await fsPromise.mkdir(outputDir, { recursive: true });
    const testContent = 'Test';
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const testFilePath = path.normalize(path.resolve(outputDir, tempOutputFile));
    await fsPromise.writeFile(testFilePath, testContent);
    const fileContentBefore = readFileSync(testFilePath, 'utf8');
    expect(fileContentBefore).toBe(testContent);

    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true,
      compile: true,
      debug: true
    });

    await generator.generateFromFile(dummySpecPath);

    const fileContent = readFileSync(tempFilePath, 'utf8');
    expect(fileContent).toBe(testContent);
    logSpyDebug.mockRestore();
  });
});
