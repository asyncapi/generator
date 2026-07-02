/**
 * @jest-environment node
 */

const { stat, readFile, mkdir, rm } = require('fs').promises;
const path = require('path');
const { 'generate:after': createAsyncapiFile } = require('../lib/officialHooks');

const dummyYAML = `
asyncapi: '2.0.0'
info:
  title: 'Dummy example'
  version: '1.0.0'
`;

const dummyJSON = JSON.stringify({
  asyncapi: '2.0.0',
  info: {
    title: 'Dummy example',
    version: '1.0.0'
  }
}, null, 2);

const flowStyleYAML = '{ asyncapi: "2.0.0", info: { title: "Dummy example", version: "1.0.0" } }';

const yamlOutputFileName = 'asyncapi.yaml';
const testResultPath = path.resolve(__dirname, './temp/officialHooks');

describe('officialHooks', () => {
  beforeEach(async () => {
    await rm(testResultPath, { recursive: true, force: true });
    await mkdir(testResultPath, { recursive: true });
  });

  it('creates a YAML file when the originalAsyncAPI is in YAML format', async () => {
    await createAsyncapiFile({
      originalAsyncAPI: dummyYAML,
      targetDir: testResultPath,
      templateParams: {}
    });

    const outputFile = path.join(testResultPath, yamlOutputFileName);
    const checkOutputFileExists = await stat(outputFile);
    const outputFileContent = await readFile(outputFile, 'utf8');

    expect(checkOutputFileExists.isFile()).toBeTruthy();
    expect(outputFileContent).toBe(dummyYAML);
  });

  it('creates a JSON file when the originalAsyncAPI is in JSON format', async () => {
    await createAsyncapiFile({
      originalAsyncAPI: dummyJSON,
      targetDir: testResultPath,
      templateParams: {}
    });

    const outputFile = path.join(testResultPath, 'asyncapi.json');
    const checkOutputFileExists = await stat(outputFile);
    const outputFileContent = await readFile(outputFile, 'utf8');

    expect(checkOutputFileExists.isFile()).toBeTruthy();
    expect(outputFileContent).toBe(dummyJSON);
  });

  it('creates a YAML file when the originalAsyncAPI is flow-style YAML', async () => {
    await createAsyncapiFile({
      originalAsyncAPI: flowStyleYAML,
      targetDir: testResultPath,
      templateParams: {}
    });

    const outputFile = path.join(testResultPath, yamlOutputFileName);
    const checkOutputFileExists = await stat(outputFile);
    const outputFileContent = await readFile(outputFile, 'utf8');

    expect(checkOutputFileExists.isFile()).toBeTruthy();
    expect(outputFileContent).toBe(flowStyleYAML);
  });

  it('creates the file in a custom directory when asyncapiFileDir parameter is provided', async () => {
    const customDir = 'custom-test';

    await createAsyncapiFile({
      originalAsyncAPI: dummyYAML,
      targetDir: testResultPath,
      templateParams: {
        asyncapiFileDir: customDir
      }
    });

    const outputFilePath = path.join(testResultPath, customDir, yamlOutputFileName);
    const checkOutputFileExists = await stat(outputFilePath);
    const outputFileContent = await readFile(outputFilePath, 'utf8');

    expect(checkOutputFileExists.isFile()).toBeTruthy();
    expect(outputFileContent).toBe(dummyYAML);
  });

  it('rejects a custom directory that resolves outside the target directory', async () => {
    await expect(createAsyncapiFile({
      originalAsyncAPI: dummyYAML,
      targetDir: testResultPath,
      templateParams: {
        asyncapiFileDir: '../outside'
      }
    })).rejects.toThrow('asyncapiFileDir "../outside" must resolve within the target directory.');
  });
});
