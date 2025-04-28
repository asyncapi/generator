const { readdir } = require('fs/promises');
const { join } = require('path');

/**
 * Get client name from AsyncAPI info.title
 *
 * @param {object} info - The AsyncAPI info object.
 * 
 * return {string} - The client name with "Client" appended at the end.
 */
const getClientName = (info) => {
  const title = info.title();
  
  // Remove spaces, make the first letter uppercase, and add "Client" at the end
  return `${title.replace(/\s+/g, '') // Remove all spaces
    .replace(/^./, char => char.toUpperCase()) // Make the first letter uppercase
  }Client`;
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
    .map(dirE => join(dir, dirE.name));
};

module.exports = {
  getClientName,
  listFiles
};
  