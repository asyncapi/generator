const path = require('path');
const { cleanTestResultPaths } = require('@asyncapi/generator-helpers');
const { runCommonTests } = require('./common-test.js');

/**
 * Configuration for different target languages.
 * Defines template location, client file name, and output directory for test results.
 */
const languageConfig = {
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

  describe('Java Quarkus Client', () => {
    const config = languageConfig.java.quarkus;

    runCommonTests('Java', config);
  });  
});