const { readdir } = require('fs/promises');

/**
 * Get client name from AsyncAPI info.title or uses a custom name if provided.
 *
 * @param {object} info - The AsyncAPI info object.
 * @param {boolean} appendClientSuffix - Whether to append "Client" to the generated name
 * @param {string} [customClientName] - Optional custom client name to use instead of generating from title
 * 
 * @returns {string} The formatted client name, either the custom name or a generated name based on the title
 */
const getClientName = (info, appendClientSuffix, customClientName) => {
  if (customClientName) {
    return customClientName;
  }
  const title = info.title();
  const baseName = `${title.replace(/\s+/g, '') // Remove all spaces
    .replace(/^./, char => char.toUpperCase())}`; // Make the first letter uppercase
  return appendClientSuffix ? `${baseName}Client` : baseName;
};

/*
 * Get the list of files in a directory
 *
 * @param {string} dir - The directory path.
 * 
 * return {Promise<string[]>} - A promise that resolves to an array of file paths.
 */
const listFiles = async (dir) => {
  const dirElements = await readdir(dir, { withFileTypes: true });

  // Filter to only files, map to full paths
  return dirElements
    .filter(dirE => dirE.isFile())
    .map(dirE => dirE.name);
};

/**
 * Validate and retrieve the AsyncAPI info object from an AsyncAPI document.
 *
 * Throws an error if the provided AsyncAPI document has no `info` section.
 *
 * @param {object} asyncapi - The AsyncAPI document object.
 * @returns {object} The validated info object from the AsyncAPI document.
 */
const getInfo = (asyncapi) => {
  if (!asyncapi) {
    throw new Error('Make sure you pass AsyncAPI document as an argument.');
  }
  if (!asyncapi.info) {
    throw new Error('Provided AsyncAPI document doesn\'t contain Info object.');
  }
  const info = asyncapi.info();
  if (!info) {
    throw new Error('AsyncAPI document info object cannot be empty.');
  }
  return info;
};

module.exports = {
  getClientName,
  listFiles,
  getInfo
};
  