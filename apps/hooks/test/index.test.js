const { stat, readFile, mkdir } = require('fs').promises;
const path = require('path');
const { 'generate:after': createAsyncapiFile } = require('../src/index.js');

const dummyYAML = `asyncapi: '2.0.0'
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

const testResultPath = path.resolve(__dirname, './temp');
const fixturesPath = path.resolve(__dirname, './__fixtures__');
const asyncapiYamlFileName = 'asyncapi.yaml';

/**
 * Builds a stand-in for the parsed AsyncAPI document, exposing just enough
 * of the real `AsyncAPIDocument.meta()` API for the hook to resolve a source
 * file path from it.
 */
const withSourcePath = (source) => ({
  meta: (key) => (key === 'asyncapi' ? { source } : undefined)
});

describe('createAsyncapiFile', () => {
  /**
     * Setup to create the test directory before running tests.
     * Ensures the test environment is ready.
     */
  beforeAll(async () => {
    await mkdir(testResultPath, { recursive: true });
  });

  it('creates a YAML file when the originalAsyncAPI is in YAML format', async () => {
    const outputFileName = asyncapiYamlFileName;
    const gen = {
      originalAsyncAPI: dummyYAML,
      targetDir: testResultPath,
      templateParams: {}
    };
    createAsyncapiFile(gen);
    const outputFile = path.join(testResultPath, outputFileName);
    const checkOutputFileExists = await stat(outputFile);
    expect(checkOutputFileExists.isFile()).toBeTruthy();
    const outputFileContent = await readFile(outputFile, 'utf8');
    expect(outputFileContent).toBe(dummyYAML);
  });

  it('creates a JSON file when the originalAsyncAPI is in JSON format', async () => {
    const outputFileName = 'asyncapi.json';
    const gen = {
      originalAsyncAPI: dummyJSON,
      targetDir: testResultPath,
      templateParams: {}
    };
    createAsyncapiFile(gen);
    const outputFile = path.join(testResultPath, outputFileName);
    const checkOutputFileExists = await stat(outputFile);
    expect(checkOutputFileExists.isFile()).toBeTruthy();
    const outputFileContent = await readFile(outputFile, 'utf8');
    expect(outputFileContent).toBe(dummyJSON);
  });

  it('creates the file in a custom directory when asyncapiFileDir parameter is provided', async () => {
    const customDir = 'custom-test';
    const outputFileName = asyncapiYamlFileName;
    const outputFilePath = path.join(testResultPath, customDir, outputFileName);
    const gen = {
      originalAsyncAPI: dummyYAML,
      targetDir: testResultPath,
      templateParams: {
        asyncapiFileDir: customDir
      }
    };
    createAsyncapiFile(gen);
    const checkOutputFileExists = await stat(outputFilePath);
    expect(checkOutputFileExists.isFile()).toBeTruthy();
    const outputFileContent = await readFile(outputFilePath, 'utf8');
    expect(outputFileContent).toBe(dummyYAML);
  });

  it('bundles external $refs into a self-contained document when a source file path is resolvable', async () => {
    const outputFileName = asyncapiYamlFileName;
    const sourcePath = path.join(fixturesPath, 'asyncapi-with-refs.yml');
    const gen = {
      asyncapi: withSourcePath(sourcePath),
      originalAsyncAPI: await readFile(sourcePath, 'utf8'),
      targetDir: testResultPath,
      templateParams: {}
    };
    await createAsyncapiFile(gen);
    const outputFile = path.join(testResultPath, outputFileName);
    const outputFileContent = await readFile(outputFile, 'utf8');

    // The server, channel and its nested message ref (commons/channels.yml -> commons/messages.yml)
    // are all inlined, so no external file $ref should survive.
    expect(outputFileContent).not.toMatch(/\$ref:\s*['"]?\.\//);
    expect(outputFileContent).toContain('host: echo.example.org');
    expect(outputFileContent).toContain('protocol: ws');
    expect(outputFileContent).toContain('address: /');
    expect(outputFileContent).toContain('type: string');
  });

  it('emits valid JSON (not YAML) into the .json file when bundling a JSON source', async () => {
    const outputFileName = 'asyncapi.json';
    const sourcePath = path.join(fixturesPath, 'asyncapi-with-refs.json');
    const gen = {
      asyncapi: withSourcePath(sourcePath),
      originalAsyncAPI: await readFile(sourcePath, 'utf8'),
      targetDir: testResultPath,
      templateParams: {}
    };
    await createAsyncapiFile(gen);
    const outputFile = path.join(testResultPath, outputFileName);
    const outputFileContent = await readFile(outputFile, 'utf8');

    // The .json extension is chosen from the original source, so the bundled
    // output written to it must be parseable JSON, not YAML.
    const parsed = JSON.parse(outputFileContent);
    expect(parsed.servers.echoServer.host).toBe('echo.example.org');
    expect(JSON.stringify(parsed)).not.toMatch(/\$ref"?:\s*['"]?\.\//);
  });

  it('does not throw for legacy parser documents whose asyncapi object lacks a meta() method', async () => {
    const outputFileName = asyncapiYamlFileName;
    const gen = {
      // Why: legacy parser documents expose no meta() method; optional chaining
      // on meta('asyncapi') alone would call an undefined method and throw.
      asyncapi: {},
      originalAsyncAPI: dummyYAML,
      targetDir: testResultPath,
      templateParams: {}
    };
    await expect(createAsyncapiFile(gen)).resolves.toBeUndefined();
    const outputFile = path.join(testResultPath, outputFileName);
    const outputFileContent = await readFile(outputFile, 'utf8');
    expect(outputFileContent).toBe(dummyYAML);
  });

  it('writes the original source verbatim when the parsed document has no resolvable source path', async () => {
    const outputFileName = asyncapiYamlFileName;
    const sourcePath = path.join(fixturesPath, 'asyncapi-with-refs.yml');
    const originalAsyncAPI = await readFile(sourcePath, 'utf8');
    const gen = {
      asyncapi: withSourcePath(undefined),
      originalAsyncAPI,
      targetDir: testResultPath,
      templateParams: {}
    };
    await createAsyncapiFile(gen);
    const outputFile = path.join(testResultPath, outputFileName);
    const outputFileContent = await readFile(outputFile, 'utf8');
    expect(outputFileContent).toBe(originalAsyncAPI);
  });

  it('falls back to writing the original source verbatim when the resolved source path does not exist on disk', async () => {
    const outputFileName = asyncapiYamlFileName;
    const sourcePath = path.join(fixturesPath, 'does-not-exist.yml');
    const gen = {
      asyncapi: withSourcePath(sourcePath),
      originalAsyncAPI: dummyYAML,
      targetDir: testResultPath,
      templateParams: {}
    };
    await createAsyncapiFile(gen);
    const outputFile = path.join(testResultPath, outputFileName);
    const outputFileContent = await readFile(outputFile, 'utf8');
    expect(outputFileContent).toBe(dummyYAML);
  });

  it('falls back to writing the original source verbatim when bundling fails on a broken external $ref', async () => {
    const outputFileName = asyncapiYamlFileName;
    const sourcePath = path.join(fixturesPath, 'asyncapi-with-broken-ref.yml');
    const originalAsyncAPI = await readFile(sourcePath, 'utf8');
    const gen = {
      asyncapi: withSourcePath(sourcePath),
      originalAsyncAPI,
      targetDir: testResultPath,
      templateParams: {}
    };
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await createAsyncapiFile(gen);
    const outputFile = path.join(testResultPath, outputFileName);
    const outputFileContent = await readFile(outputFile, 'utf8');
    expect(outputFileContent).toBe(originalAsyncAPI);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});
