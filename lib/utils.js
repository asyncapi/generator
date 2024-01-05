const fs = require('fs');
const util = require('util');
const path = require('path');
const fetch = require('node-fetch');
const url = require('url');
const resolvePkg = require('resolve-pkg');
const resolveFrom = require('resolve-from');
const globalDirs = require('global-dirs');
const log = require('loglevel');

const packageJson = require('../package.json');

const logMessage = require('./logMessages.js');

const utils = module.exports;

utils.lstat = util.promisify(fs.lstat);
utils.readlink = util.promisify(fs.readlink);
utils.readFile = util.promisify(fs.readFile);
utils.writeFile = util.promisify(fs.writeFile);
utils.copyFile = util.promisify(fs.copyFile);
utils.readDir = util.promisify(fs.readdir);

utils.exists = async (path) => {
  try {
    await fs.promises.stat(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    // File does not exist.
    log.debug(`File ${path} couldn't be found. Error: ${error.message}`);
    return false;
  }
};

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
 * Returns whether or not the template is a react template
 *
 * @param {object} templateConfig
 * @returns {boolean} Whether the template is a React template or not.
 */
utils.isReactTemplate = (templateConfig) => {
  return templateConfig !== undefined && templateConfig.renderer === 'react';
};

/**
 * Fetches an AsyncAPI document from the given URL and return its content as string
 *
 * @param {String} link URL where the AsyncAPI document is located.
 * @returns {Promise<String>} Content of fetched file.
 */
utils.fetchSpec = (link) => {
  return new Promise((resolve, reject) => {
    fetch(link)
      .then(res => resolve(res.text()))
      .catch(reject);
  });
};

/**
 * Checks if given string is URL and if not, we assume it is file path
 *
 * @param {String} str information representing file path or url
 * @returns {Boolean}
 */
utils.isFilePath = (str) => {
  return !url.parse(str).hostname;
};

/**
 * Checks if given file path is JS file
 *
 * @param {String} filename information representing file path
 * @returns {Boolean}
 */
utils.isJsFile = (filepath) => {
  const ext = filepath.split('.').pop() || '';
  return ['js', 'jsx', 'cjs'].includes(ext);
};

/**
 * Get version of the generator
 *
 * @returns {String}
 */
utils.getGeneratorVersion = () => {
  return packageJson.version;
};

/**
 * Determine whether the given function is asynchronous.
 * @private
 * @param {*} fn to check
 * @returns {Boolean} is function asynchronous
 */
utils.isAsyncFunction = (fn) => {
  return fn && fn.constructor && fn.constructor.name === 'AsyncFunction';
};

/**
 * Register `source-map-support` package.
 * This package provides source map support for stack traces in Node - also for transpiled code from TS.
 *
 * @private
 */
utils.registerSourceMap = () => {
  require('source-map-support').install();
};

/**
 * Register TypeScript transpiler. It enables transpilation of TS filters and hooks on the fly.
 *
 * @private
 */
utils.registerTypeScript = () => {
  const { REGISTER_INSTANCE, register } = require('ts-node');
  // if the ts-node has already been registered before, do not register it again.
  // Check the env. TS_NODE_ENV if ts-node started via ts-node-dev package
  if (process[REGISTER_INSTANCE] || process.env.TS_NODE_DEV) {
    return;
  }
  register();
};

/**
 * Check if given template is installed and return details about it located in the package.json
 *
 * @private
 * @param {String} name name of the template
 * @param {String} PACKAGE_JSON_FILENAME standard name of the package.json file
 * @returns {Object|undefined} object representing content of the package.json file with additional field -> pkgPath (absolute path to the package). Read {@link https://raw.githubusercontent.com/sindresorhus/type-fest/main/source/package-json.d.ts|PackageJson} for more details on the content of the package.json object

 */
utils.getTemplateDetails = (name, PACKAGE_JSON_FILENAME) => {
  let pkgPath;
  let pkgPackageJsonPath;
  let installedPkg;

  //first trying to resolve package by its path
  //this could be done at the end, without additional if but the advantage if below approach is that we explicitly know resolving was successful by the template file path and we can log proper debug info
  if (utils.isFileSystemPath(name)) {
    pkgPath = path.resolve(name);

    log.debug(logMessage.NODE_MODULES_INSTALL);
  } else {
    //first trying to resolve package in local dependencies of generator or the project that uses generator library
    //return path doesn't point to package.json
    pkgPath = resolvePkg(name);
    //resolvePkg returns undefined if dependency is not found in local dependencies

    //now we need to look for the template in the global location
    //we use resolveFrom with package.json reference as normal resolve fails on template because they do not have entrypoint ("main" property) as packages normally do.
    if (!pkgPath) {
      try {
        //trying to find in global yarn location
        pkgPackageJsonPath = resolveFrom(globalDirs.yarn.packages, path.join(name, PACKAGE_JSON_FILENAME));
      } catch (_) {
        //trying to find in global npm location
        pkgPackageJsonPath = resolveFrom(globalDirs.npm.packages, path.join(name, PACKAGE_JSON_FILENAME));
      }

      if (pkgPackageJsonPath) {
        log.debug(logMessage.templateNotFound(name));
        //removing package.json from path
        pkgPath = path.dirname(pkgPackageJsonPath);
      }
    }
  }

  if (pkgPath) {
    installedPkg = require(path.join(pkgPath, PACKAGE_JSON_FILENAME));
    //we add path to returned object only because later we want to use it in debug logs
    installedPkg.pkgPath = pkgPath;
  }

  return installedPkg;
};

utils.convertCollectionToObject = (array, idFunction) => {
  const tempObject = {};
  for (const value of array) {
    const id = value[idFunction]();
    tempObject[id] = value;
  }
  return tempObject;
};
