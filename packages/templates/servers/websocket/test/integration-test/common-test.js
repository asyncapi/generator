const Generator = require('@asyncapi/generator');
const { verifyDirectoryStructure, getDirElementsRecursive } = require('@asyncapi/generator-helpers');

jest.setTimeout(100000);

/**
 * Generates a project from a template and snapshots every generated file.
 *
 * @param {string} template Template directory.
 * @param {string} outputPath Directory to generate into.
 * @param {string} asyncapiPath AsyncAPI document to generate from.
 * @param {object} params Template parameters.
 * @returns {Promise<void>}
 */
async function generateAndVerify(template, outputPath, asyncapiPath, params) {
  const generator = new Generator(template, outputPath, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(asyncapiPath);
  const directoryElements = await getDirElementsRecursive(outputPath);
  await verifyDirectoryStructure(directoryElements, outputPath);
}

module.exports = { generateAndVerify };
