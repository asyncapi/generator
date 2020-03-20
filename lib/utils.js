const fs = require('fs');
const util = require('util');
const path = require('path');
const utils = module.exports;

const lstat = util.promisify(fs.lstat);
const readlink = util.promisify(fs.readlink);

utils.isFileSystemPath = (string) => {
  return path.isAbsolute(string)
    || string.startsWith(`.${path.sep}`)
    || string.startsWith(`..${path.sep}`)
    || string.startsWith('~');
};

utils.beautifyNpmiResult = (result) => {
  const [nameWithVersion, pkgPath] = result[0];
  const nameWithVersionArray = nameWithVersion.split('@');
  const version = nameWithVersionArray[nameWithVersionArray.length - 1];
  const name = nameWithVersionArray.splice(0, nameWithVersionArray.length - 1).join('@');

  return {
    name,
    path: pkgPath,
    version,
  };
};

utils.convertMapToObject = (map) => {
  const tempObject = {};
  for (const [key, value] of map.entries()) {
    tempObject[key] = value;
  }
  return tempObject;
};

utils.isLocalTemplate = async (templatePath) => {
  const stats = await lstat(templatePath);
  return stats.isSymbolicLink();
};

utils.getLocalTemplateDetails = async (templatePath) => {
  const linkTarget = await readlink(templatePath);
  return {
    link: linkTarget,
    resolvedLink: path.resolve(path.dirname(templatePath), linkTarget),
  };
};
