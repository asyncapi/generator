const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const { readdir } = require('fs/promises');
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

  // List the files & folders in the output directory
  const directoryElements = await getDirElementsRecursive(outputPath);

  await verifyDirectoryStructure(directoryElements, outputPath);
  
}

/**
 * Helper function to recursively get all files and directories in a given directory.
 * @param {string} dir - The directory path to scan.
 */
async function getDirElementsRecursive(dir) {
  let elements = [];
  
  const items = await readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      // If it's a directory, add it to the list and recurse into it
      elements.push({
        type: 'directory',
        name: item.name,
        path: fullPath,
        children: await getDirElementsRecursive(fullPath)
      });
    } else {
      // If it's a file, just add it to the list
      elements.push({
        type: 'file',
        name: item.name,
        path: fullPath
      });
    }
  }

  return elements;
}

/**
 * Helper function to verify the directory structure against expected elements.
 * @param {Array} expectedElements - The expected elements in the directory.
 * @param {string} dirPath - The path of the directory to verify.
 */
async function verifyDirectoryStructure(expectedElements, dirPath) {
  for (const element of expectedElements) {
    const filePath = path.join(dirPath, element.name);

    if (element.type === 'directory') {
      // Get the contents of the directory
      const subdirContent = await getDirElementsRecursive(filePath);
      
      // Recurse into the subdirectory
      await verifyDirectoryStructure(subdirContent, filePath);
    } else if (element.type === 'file') {
      // Verifying a file
      try {
        const content = await readFile(filePath, 'utf8');
        expect(content).toMatchSnapshot(element.name);
      } catch (err) {
        throw new Error(`File ${filePath} not found or couldn't be read.`);
      }
    }
  }
}

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