const fs = require('fs');
const util = require('util');
const path = require('path');
const utils = module.exports;

utils.lstat = util.promisify(fs.lstat);
utils.readlink = util.promisify(fs.readlink);
utils.readFile = util.promisify(fs.readFile);
utils.writeFile = util.promisify(fs.writeFile);
utils.copyFile = util.promisify(fs.copyFile);
utils.exists = util.promisify(fs.exists);
utils.readDir = util.promisify(fs.readdir);

/**
 * Checks if a string is a filesystem path.
 * @private
 * @param {String} string The string to check.
 * @returns {Boolean} Whether the string is a filesystem path or not.
 */
utils.isFileSystemPath = (string) => {
  return path.isAbsolute(string)
    || string.startsWith(`.${path.sep}`)
    || string.startsWith(`..${path.sep}`)
    || string.startsWith('~');
};

/**
 * Takes the result of calling the npmi module and returns it in a more consumable form.
 * @private
 * @param {Array} result The result of calling npmi.
 * @returns {Object}
 */
utils.beautifyNpmiResult = (result) => {
  const [nameWithVersion, pkgPath] = result[result.length-1];
  const nameWithVersionArray = nameWithVersion.split('@');
  const version = nameWithVersionArray[nameWithVersionArray.length - 1];
  const name = nameWithVersionArray.splice(0, nameWithVersionArray.length - 1).join('@');

  return {
    name,
    path: pkgPath,
    version,
  };
};

/**
 * Converts a Map into an object.
 * @private
 * @param {Map} map The map to transform.
 * @returns {Object}
 */
utils.convertMapToObject = (map) => {
  const tempObject = {};
  for (const [key, value] of map.entries()) {
    tempObject[key] = value;
  }
  return tempObject;
};

/**
 * Checks if template is local or not (i.e., it's remote).
 * @private
 * @param {String} templatePath The path to the template.
 * @returns {Promise<Boolean>}
 */
utils.isLocalTemplate = async (templatePath) => {
  const stats = await utils.lstat(templatePath);
  return stats.isSymbolicLink();
};

/**
 * Gets the details (link and resolved link) of a local template.
 * @private
 * @param {String} templatePath The path to the template.
 * @returns {Promise<Object>}
 */
utils.getLocalTemplateDetails = async (templatePath) => {
  const linkTarget = await utils.readlink(templatePath);
  return {
    link: linkTarget,
    resolvedLink: path.resolve(path.dirname(templatePath), linkTarget),
  };
};
