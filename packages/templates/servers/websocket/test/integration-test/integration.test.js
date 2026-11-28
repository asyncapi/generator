const path = require('path');
const { cleanTestResultPaths } = require('@asyncapi/generator-helpers');
const { generateAndVerify } = require('./common-test.js');
// The websocket fixtures are kept beside the websocket clients. This one describes the echo server from the server's perspective.
const asyncapi_v3_path_hoppscotch_server = path.resolve(__dirname, '../../../../clients/websocket/test/__fixtures__/asyncapi-hoppscotch-server.yml');

/**
 * Configuration for different target languages.
 * Defines template location and output directory for test results.
 */
const languageConfig = {
  javascript: {
    testResultPath: path.resolve(__dirname, '../../javascript/test/temp/snapshotTestResult'),
    template: path.resolve(__dirname, '../../javascript')
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

describe('WebSocket Servers Integration Tests', () => {
  beforeAll(async () => {
    const client = process.env.TEST_CLIENT;
    const configsToClean = getConfig(client);
    await Promise.all(
      configsToClean.map((config) =>
        cleanTestResultPaths({ testResultPath: config.testResultPath })
      )
    );
  });

  runTestSuiteForClient('javascript', () => {
    describe('JavaScript Server', () => {
      const config = languageConfig.javascript;

      it('generate server for hoppscotch echo', async () => {
        await generateAndVerify(
          config.template,
          path.join(config.testResultPath, 'server_hoppscotch'),
          asyncapi_v3_path_hoppscotch_server,
          { server: 'echoServer' }
        );
      });
    });
  });
});
