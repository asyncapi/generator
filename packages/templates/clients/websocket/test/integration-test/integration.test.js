
const path = require('path');
const { readFile, stat } = require('fs').promises;
const { rm } = require('fs/promises');
const Generator = require('@asyncapi/generator');
const { listFiles } = require('@asyncapi/generator-helpers');
const { runCommonTests } = require('./common-test.js');
const asyncapi_v3_path_slack = path.resolve(__dirname, '../__fixtures__/asyncapi-slack-client.yml');
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
  js: {
    clientFileName: 'client.js',
    testResultPath: path.resolve(__dirname, '../../javascript/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../javascript')
  },
  dart: {
    clientFileName: 'client.dart',
    testResultPath: path.resolve(__dirname, '../../dart/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../dart')
  }
};

describe('Dart Client', () => {
  const config = languageConfig.dart;

  beforeAll(async () => {
    await rm(config.testResultPath, { recursive: true, force: true });
  });

  runCommonTests('Dart', config);
});

describe('Python Client', () => {
  const config = languageConfig.python;

  beforeAll(async () => {
    await rm(config.testResultPath, { recursive: true, force: true });
  });

  runCommonTests('Python', config);

  describe('Additional tests for Python client', () => {
    it('generate client for slack', async () => {
      const testResultPathSlack = path.join(config.testResultPath, 'client_slack');
      const generator = new Generator(config.template, testResultPathSlack, {
        forceWrite: true,
        templateParams: {
          server: 'production',
          clientFileName: config.clientFileName
        }
      });
      await generator.generateFromFile(asyncapi_v3_path_slack);
      const testOutputFiles = await listFiles(testResultPathSlack);
      for (const testOutputFile of testOutputFiles) {
        const filePath = path.join(testResultPathSlack, testOutputFile);
        const content = await readFile(filePath, 'utf8');
        expect(content).toMatchSnapshot(testOutputFile);
      }
    });
  });
});

describe('JavaScript Client', () => {
  const config = languageConfig.js;

  beforeAll(async () => {
    await rm(config.testResultPath, { recursive: true, force: true });
  });

  runCommonTests('JavaScript', config);

  describe('Additional tests for JavaScript client', () => {
    it('generate simple client for hoppscotch echo without clientFileName param', async () => {
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
    });

    it('should throw an error when server param is missing during simple client generation for hoppscotch echo', async () => {
      const generator = new Generator(config.template, config.testResultPath, {
        forceWrite: true,
        templateParams: {
          clientFileName: config.clientFileName
        }
      });
      await expect(generator.generateFromFile(asyncapi_v3_path_hoppscotch)).rejects.toThrow('This template requires the following missing params: server');
    });
  });
});
