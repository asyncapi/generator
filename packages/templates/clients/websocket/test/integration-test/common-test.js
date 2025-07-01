const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const { listFiles } = require('@asyncapi/generator-helpers');
const asyncapi_v3_path_postman = path.resolve(__dirname, '../__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../__fixtures__/asyncapi-hoppscotch-client.yml');

/**
 * Helper function to generate client and verify snapshots
 */
async function generateAndVerifyClient(template, outputPath, asyncapiPath, params) {
  const generator = new Generator(template, outputPath, {
    forceWrite: true,
    templateParams: params
  });

  await generator.generateFromFile(asyncapiPath);

  const testOutputFiles = await listFiles(outputPath);
  
  for (const testOutputFile of testOutputFiles) {
    const filePath = path.join(outputPath, testOutputFile);
    const content = await readFile(filePath, 'utf8');
    expect(content).toMatchSnapshot(testOutputFile);
  }
}

/**
 * Run snapshot tests for code generation across multiple AsyncAPI specifications.
 * Tests generation of standard client, and client with a custom client name.
 *
 * @param {string} language - Name of the language being tested (e.g., "Python", "JavaScript", "Dart")
 * @param {object} config - Configuration object from languageConfig
 */
async function runCommonTests(language, config) {
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
        {
          server: 'echoServer',
          clientFileName: config.clientFileName,
          appendClientSuffix: true
        }
      ],
      [
        'hoppscotch echo',
        testResultPathHoppscotch,
        asyncapi_v3_path_hoppscotch,
        {
          server: 'echoServer',
          clientFileName: config.clientFileName
        }
      ],
      [
        'hoppscotch echo with custom client name',
        testResultPathCustomHoppscotch,
        asyncapi_v3_path_hoppscotch,
        {
          server: 'echoServer',
          clientFileName: config.clientFileName,
          customClientName: 'HoppscotchClient'
        }
      ]
    ])('generate simple client for %s', async (_, outputPath, asyncapiPath, params) => {
      await generateAndVerifyClient(config.template, outputPath, asyncapiPath, params);
    });
  });
}

module.exports = { runCommonTests };