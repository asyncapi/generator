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

module.exports = {
  getClientName,
  listFiles
};
  