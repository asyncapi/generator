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
  return fn?.constructor?.name === 'AsyncFunction';
};

/**
 * Register TypeScript transpiler. It enables transpilation of TS filters and hooks on the fly.
 *
 * @private
 */
utils.registerTypeScript = (filePath) => {
  const isTypescriptFile = filePath.endsWith('.ts');
  
  if (!isTypescriptFile) {
    return;
  }
  
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

/**
 * Validates that a file path stays within a base directory to prevent path traversal attacks.
 * 
 * @param {string} filePath - The file path to validate (can be relative or absolute)
 * @param {string} baseDir - The base directory that the file path must stay within
 * @param {string} [operation='access'] - The operation being performed (for error messages)
 * @returns {string} The normalized, validated absolute path
 * @throws {Error} If the path attempts to escape the base directory or if inputs are invalid
 * @throws {TypeError} If filePath or baseDir are not non-empty strings
 * 
 * @note This function uses fs.realpathSync() for the base directory when it exists to resolve
 *       symlinks and get filesystem-canonical paths for better security. On Windows, path
 *       comparisons are case-insensitive to match the case-insensitive filesystem behavior.
 *       Root directory edge cases (e.g., / or C:\) are handled correctly.
 */
utils.validatePathWithinBase = (filePath, baseDir, operation = 'access') => {
  // Input validation: ensure both parameters are non-empty strings
  if (typeof filePath !== 'string' || filePath.trim().length === 0) {
    throw new TypeError(`Invalid filePath: expected non-empty string, got ${typeof filePath}`);
  }
  
  if (typeof baseDir !== 'string' || baseDir.trim().length === 0) {
    throw new TypeError(`Invalid baseDir: expected non-empty string, got ${typeof baseDir}`);
  }
  
  // Resolve and normalize both paths
  const resolvedBaseDir = path.resolve(baseDir);
  const resolvedFilePath = path.isAbsolute(filePath) 
    ? path.resolve(filePath)
    : path.resolve(resolvedBaseDir, filePath);
  
  // Get canonical path for base directory (should exist, resolves symlinks and gets filesystem case)
  // For filePath, we can't use realpath if it doesn't exist yet (validation before access)
  let canonicalBase = resolvedBaseDir;
  try {
    canonicalBase = fs.realpathSync(resolvedBaseDir);
  } catch (err) {
    // Base directory may not exist, use resolved path
    canonicalBase = resolvedBaseDir;
  }
  
  const normalizedBase = path.normalize(canonicalBase);
  const normalizedFilePath = path.normalize(resolvedFilePath);
  
  // Ensure base has trailing separator for the check, unless it already has one
  // This handles root directory edge case (e.g., / or C:\)
  const baseWithSep = normalizedBase.endsWith(path.sep) 
    ? normalizedBase 
    : normalizedBase + path.sep;
  
  // Check if the file path is within the base directory
  // Allow the base directory itself or files within it
  // Use case-insensitive comparison on Windows due to case-insensitive filesystem
  const isWithinBase = process.platform === 'win32'
    ? (normalizedFilePath.toLowerCase() === normalizedBase.toLowerCase() ||
       normalizedFilePath.toLowerCase().startsWith(baseWithSep.toLowerCase()))
    : (normalizedFilePath === normalizedBase ||
       normalizedFilePath.startsWith(baseWithSep));
  
  if (!isWithinBase) {
    throw new Error(
      `Path traversal detected: attempted to ${operation} "${filePath}" ` +
      `which resolves to "${normalizedFilePath}" outside base directory "${normalizedBase}". ` +
      `This is a security violation and has been blocked.`
    );
  }
  
  return normalizedFilePath;
};
