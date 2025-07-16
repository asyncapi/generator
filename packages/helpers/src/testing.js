const { readFile, rm } = require('fs').promises;
const { readdir } = require('fs/promises');
const path = require('path');

/**
 * Helper function to clean up test result paths recursively.
 * @param {Object} config - The configuration object containing paths to clean. 
 */
async function cleanTestResultPaths(config) {
  if (!config) return;

  if (config.testResultPath) {
    try {
      await rm(config.testResultPath, { recursive: true, force: true });
    } catch (error) {
      console.error(`Failed to clean ${config.testResultPath}: ${error.message}`);
    }
  } else if (!hasNestedConfig(config)) {
    console.warn('Configuration missing testResultPath - no test results to clean:', config);
  }

  // Recursively check nested configurations
  for (const subConfig of Object.values(config)) {
    if (typeof subConfig === 'object' && subConfig !== null) {
      await cleanTestResultPaths(subConfig);
    }
  }
}

// Helper function to check if config has nested sub-configs
function hasNestedConfig(obj) {
  return Object.values(obj).some(val => typeof val === 'object' && val !== null);
}

/**
 * Helper function to recursively get all files and directories in a given directory.
 * @param {string} dir - The directory path to scan.
 */
async function getDirElementsRecursive(dir) {
  const elements = [];
  
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
 * Helper function to build parameters for the test cases.
 * 
 * Note: This function is currently hardcoded to treat 'java' differently by excluding the 'clientFileName' parameter.
 * Consider refactoring if language-specific logic grows.
 * 
 * @param {string} language - The target language (e.g., 'java', 'dart').
 * @param {Object} config - Configuration object containing test settings.
 * @param {Object} [baseParams={}] - Additional parameters to merge into the final set.
 * @returns {Object} - The final parameters object for use in the test case.
 */
function buildParams(language, config, baseParams = {}) {
  const isJava = language.toLowerCase() === 'java';

  return {
    server: 'echoServer',
    ...(isJava ? {} : { clientFileName: config.clientFileName }),
    ...baseParams,
  };
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
        throw new Error(`File ${filePath} not found or couldn't be read. Original error: ${err.message}`);
      }
    }
  }
}

module.exports = {
  cleanTestResultPaths,
  getDirElementsRecursive,
  verifyDirectoryStructure,
  buildParams
};