const { verifyDirectoryStructure, getDirElementsRecursive, buildParams } = require('@asyncapi/generator-helpers');
const path = require('path');
const Generator = require('@asyncapi/generator');
const asyncapi_v3_path_adeo = path.resolve(__dirname, '../__fixtures__/asyncapi-adeo.yml');

/**
 * Helper function to generate client and verify snapshots
 */
async function generateAndVerifyClient(template, outputPath, asyncapiPath, params) {
  const generator = new Generator(template, outputPath, {
    forceWrite: true,
    templateParams: params
  });

  await generator.generateFromFile(asyncapiPath);

  // List the files & folders in the output directory
  const directoryElements = await getDirElementsRecursive(outputPath);

  await verifyDirectoryStructure(directoryElements, outputPath);
}

/**
 * Run snapshot tests for code generation across multiple AsyncAPI specifications.
 * Tests generation of standard client, and client with a custom client name.
 *
 * @param {string} language - Name of the language being tested (e.g., "Python", "JavaScript", "Dart")
 * @param {object} config - Configuration object from languageConfig
 */
function runCommonTests(language, config) {
  const testResultPathAdeo = path.join(config.testResultPath, 'client_adeo');

  describe(`Common Integration tests for ${language} client generation`, () => {
    jest.setTimeout(100000);
    test.each([
      [
        'adeo case study',
        testResultPathAdeo,
        asyncapi_v3_path_adeo,
        buildParams(language, config, 'production')
      ],
    ])('generate simple client for %s', async (_, outputPath, asyncapiPath, params) => {
      await generateAndVerifyClient(config.template, outputPath, asyncapiPath, params);
    });
  });
}

module.exports = { runCommonTests };