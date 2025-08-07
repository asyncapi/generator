const path = require('path');
const { stat } = require('fs').promises;
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
  js: {
    clientFileName: 'client.js',
    testResultPath: path.resolve(__dirname, '../../javascript/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../javascript')
  },
  dart: {
    clientFileName: 'client.dart',
    testResultPath: path.resolve(__dirname, '../../dart/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../dart')
  },
  java: {
    quarkus: {
      testResultPath: path.resolve(__dirname, '../../java/quarkus/test/temp/snapshotTestResult'),
      template: path.resolve(__dirname, '../../java/quarkus')
    }
  }
};

describe('WebSocket Clients Integration Tests', () => {
  beforeAll(async () => {
    await Promise.all(
      Object.values(languageConfig).map(async (config) => 
        await cleanTestResultPaths(config)
      )
    );
  });

  describe('Dart Client', () => {
    const config = languageConfig.dart;

    runCommonTests('Dart', config);
  });

  describe('Java Quarkus Client', () => {
    const config = languageConfig.java.quarkus;

    runCommonTests('Java', config);
    runCommonSlackTests('Java', config);
  });

  describe('Python Client', () => {
    const config = languageConfig.python;

    runCommonTests('Python', config);
    runCommonSlackTests('Python', config);
  });

  describe('JavaScript Client', () => {
    const config = languageConfig.js;

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
});