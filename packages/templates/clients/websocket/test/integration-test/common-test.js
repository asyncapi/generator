const { buildParams, generateAndVerifyClient } = require('@asyncapi/generator-helpers');
const path = require('path');
const asyncapi_v3_path_postman = path.resolve(__dirname, '../__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../__fixtures__/asyncapi-hoppscotch-client.yml');
const asyncapi_v3_path_slack = path.resolve(__dirname, '../__fixtures__/asyncapi-slack-client.yml');

/**
 * Run snapshot tests for code generation across multiple AsyncAPI specifications.
 * Tests generation of standard client, and client with a custom client name.
 *
 * @param {string} language - Name of the language being tested (e.g., "Python", "JavaScript", "Dart")
 * @param {object} config - Configuration object from languageConfig
 */
function runCommonTests(language, config) {
  const testResultPathPostman = path.join(config.testResultPath, 'client_postman');
  const testResultPathHoppscotch = path.join(config.testResultPath, 'client_hoppscotch');
  const testResultPathCustomHoppscotch = path.join(config.testResultPath, 'custom_client_hoppscotch');

  describe(`Common Integration tests for ${language} client generation`, () => {
    jest.setTimeout(100000);
    test.each([
      [
        'postman echo',
        testResultPathPostman,
        asyncapi_v3_path_postman,
        buildParams(language, config, 'echoServer', { appendClientSuffix: true })
      ],
      [
        'hoppscotch echo',
        testResultPathHoppscotch,
        asyncapi_v3_path_hoppscotch,
        buildParams(language, config, 'echoServer')
      ],
      [
        'hoppscotch echo with custom client name',
        testResultPathCustomHoppscotch,
        asyncapi_v3_path_hoppscotch,
        buildParams(language, config, 'echoServer', { customClientName: 'HoppscotchClient' })
      ]
    ])('generate simple client for %s', async (_, outputPath, asyncapiPath, params) => {
      await generateAndVerifyClient(config.template, outputPath, asyncapiPath, params);
    });
  });
}

function runCommonSlackTests(language, config) {
  const testResultPathSlack = path.join(config.testResultPath, 'client_slack');

  describe(`Additional tests for ${language} client`, () => {
    jest.setTimeout(100000);
    it('generate client for slack', async () => {
      await generateAndVerifyClient(
        config.template,
        testResultPathSlack,
        asyncapi_v3_path_slack,
        buildParams(language, config, 'production')
      );
    });
  });
}

module.exports = { runCommonTests, runCommonSlackTests };