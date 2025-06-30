// test/shared/commonTests.js
const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const { listFiles } = require('@asyncapi/generator-helpers');
const asyncapi_v3_path_postman = path.resolve(__dirname, '../__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../__fixtures__/asyncapi-hoppscotch-client.yml');

/**
 * Run snapshot tests for code generation across multiple AsyncAPI specifications.
 * Tests generation of standard client, and client with a custom client name.
 *
 * @param {string} language - Name of the language being tested (e.g., "Python", "JavaScript", "Dart")
 * @param {object} config - Configuration object from languageConfig
 * @param {string} asyncapi_v3_path_postman - Path to Postman AsyncAPI fixture
 * @param {string} asyncapi_v3_path_hoppscotch - Path to Hoppscotch AsyncAPI fixture
 */
async function runCommonTests(language, config) {
  const testResultPathPostman = path.join(config.testResultPath, 'client_postman');
  const testResultPathHoppscotch = path.join(config.testResultPath, 'client_hoppscotch');
  const testResultPathCustomHoppscotch = path.join(config.testResultPath, 'custom_client_hoppscotch');

  describe(`Common Integration test for ${language} client generation`, () => {
    jest.setTimeout(100000);

    it('generate simple client for postman echo', async () => {
      const generator = new Generator(config.template, testResultPathPostman, {
        forceWrite: true,
        templateParams: {
          server: 'echoServer',
          clientFileName: config.clientFileName,
          appendClientSuffix: true
        }
      });

      await generator.generateFromFile(asyncapi_v3_path_postman);

      const testOutputFiles = await listFiles(testResultPathPostman);

      for (const testOutputFile of testOutputFiles) {
        const filePath = path.join(testResultPathPostman, testOutputFile);
        const content = await readFile(filePath, 'utf8');
        expect(content).toMatchSnapshot(testOutputFile);
      }
    });

    it('generate simple client for hoppscotch echo', async () => {
      const generator = new Generator(config.template, testResultPathHoppscotch, {
        forceWrite: true,
        templateParams: {
          server: 'echoServer',
          clientFileName: config.clientFileName
        }
      });

      await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

      const testOutputFiles = await listFiles(testResultPathHoppscotch);

      for (const testOutputFile of testOutputFiles) {
        const filePath = path.join(testResultPathHoppscotch, testOutputFile);
        const content = await readFile(filePath, 'utf8');
        expect(content).toMatchSnapshot(testOutputFile);
      }
    });

    it('generate simple client for hoppscotch echo with custom client name', async () => {
      const generator = new Generator(config.template, testResultPathCustomHoppscotch, {
        forceWrite: true,
        templateParams: {
          server: 'echoServer',
          clientFileName: config.clientFileName,
          customClientName: 'HoppscotchClient'
        }
      });

      await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

      const testOutputFiles = await listFiles(testResultPathCustomHoppscotch);

      for (const testOutputFile of testOutputFiles) {
        const filePath = path.join(testResultPathCustomHoppscotch, testOutputFile);
        const content = await readFile(filePath, 'utf8');
        expect(content).toMatchSnapshot(testOutputFile);
      }
    });
  });
}

module.exports = { runCommonTests };
