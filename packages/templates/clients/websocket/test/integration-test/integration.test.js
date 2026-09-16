const path = require('path');
const { stat, readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const { cleanTestResultPaths } = require('@asyncapi/generator-helpers');
const { runCommonTests, runCommonSlackTests } = require('./common-test.js');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../__fixtures__/asyncapi-hoppscotch-client.yml');

/**
 * Configuration for different target languages.
 * Defines template location, client file name, and output directory for test results.
 */
const languageConfig = {
  python: {
    clientFileName: 'client.py',
    testResultPath: path.resolve(__dirname, '../../python/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../python')
  },
  javascript: {
    clientFileName: 'client.js',
    testResultPath: path.resolve(__dirname, '../../javascript/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../javascript')
  },
  dart: {
    clientFileName: 'client.dart',
    testResultPath: path.resolve(__dirname, '../../dart/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../dart')
  },
  'java-quarkus': {
    clientFileName: 'Client.java',
    testResultPath: path.resolve(__dirname, '../../java/quarkus/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../java/quarkus')
  }
};

function getConfig(client) {
  if (!client) return Object.values(languageConfig);

  const config = languageConfig[client];

  if (!config) {
    throw new Error(
      `Invalid TEST_CLIENT="${client}". Valid options: ${Object.keys(languageConfig).join(', ')}`
    );
  }

  return [config];
}

function runTestSuiteForClient(clientKey, testSuiteFn) {
  const targetClient = process.env.TEST_CLIENT;
  if (!targetClient || targetClient === clientKey) {
    testSuiteFn();
  }
}

describe('WebSocket Clients Integration Tests', () => {
  beforeAll(async () => {
    const client = process.env.TEST_CLIENT;
    const configsToClean = getConfig(client);
    await Promise.all(
      configsToClean.map((config) =>
        cleanTestResultPaths({ testResultPath: config.testResultPath }) 
      )
    );
  });

  runTestSuiteForClient('dart', () => {
    describe('Dart Client', () => {
      const config = languageConfig.dart;
      runCommonTests('Dart', config);
    });
  });

  runTestSuiteForClient('java-quarkus', () => {
    describe('Java Quarkus Client', () => {
      const config = languageConfig['java-quarkus'];
      runCommonTests('Java', config);
      runCommonSlackTests('Java', config);
    });
  });
  
  runTestSuiteForClient('python', () => {
    describe('Python Client', () => {
      const config = languageConfig.python;
      runCommonTests('Python', config);
      runCommonSlackTests('Python', config);
    });
  });

  runTestSuiteForClient('javascript', () => {
    describe('JavaScript Client', () => {
      const config = languageConfig.javascript;
      runCommonTests('JavaScript', config);

      describe('Additional tests for JavaScript client', () => {
        it.each([
          ['default directory', undefined, '.'],
          ['custom directory', 'specs', 'specs']
        ])('references asyncapi.json for JSON input in the %s', async (_, asyncapiFileDir, expectedDir) => {
          const asyncapiPath = path.resolve(
            __dirname,
            '../../../../../../apps/hooks/test/__fixtures__/asyncapi-with-refs.json'
          );
          const outputPath = path.join(config.testResultPath, `client_json_${asyncapiFileDir || 'default'}`);
          const generator = new Generator(config.template, outputPath, {
            forceWrite: true,
            templateParams: {
              server: 'echoServer',
              ...(asyncapiFileDir === undefined ? {} : { asyncapiFileDir })
            }
          });

          await generator.generateFromFile(asyncapiPath);

          const generatedDocument = await readFile(path.join(outputPath, expectedDir, 'asyncapi.json'), 'utf8');
          expect(JSON.parse(generatedDocument).asyncapi).toBe('3.0.0');

          const generatedClient = await readFile(path.join(outputPath, config.clientFileName), 'utf8');
          expect(generatedClient).toContain(
            `const asyncapiFilepath = path.resolve(__dirname, '${expectedDir}/asyncapi.json');`
          );
        }, 30000);

        it('uses the default client filename and references asyncapi.yaml for a custom-named .yml input', async () => {
          const defaultOutputFile = 'client.js';
          const generator = new Generator(config.template, config.testResultPath, {
            forceWrite: true,
            templateParams: {
              server: 'echoServer',
            }
          });
          await generator.generateFromFile(asyncapi_v3_path_hoppscotch);
          const clientOutputFile = path.join(config.testResultPath, defaultOutputFile);
          const checkClientOutputFileExists = await stat(clientOutputFile);
          expect(checkClientOutputFileExists.isFile()).toBeTruthy();
          const documentOutputFile = await stat(path.join(config.testResultPath, 'asyncapi.yaml'));
          expect(documentOutputFile.isFile()).toBeTruthy();
          const generatedClient = await readFile(clientOutputFile, 'utf8');
          expect(generatedClient).toContain(
            'const asyncapiFilepath = path.resolve(__dirname, \'./asyncapi.yaml\');'
          );
        }, 30000);
      });
    });
  });
});
