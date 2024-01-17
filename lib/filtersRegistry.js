const path = require('path');
const fs = require('fs');
const xfs = require('fs.extra');
const { isAsyncFunction } = require('./utils');

/**
 * Registers all template filters.
 * @param {Object} nunjucks Nunjucks environment.
 * @param {Object} templateConfig Template configuration.
 * @param {String} templateDir Directory where template is located.
 * @param {String} filtersDir Directory where local filters are located.
 */
module.exports.registerFilters = async (nunjucks, templateConfig, templateDir, filtersDir) => {
  await registerLocalFilters(nunjucks, templateDir, filtersDir);
  registerConfigFilters(nunjucks, templateDir, templateConfig);
};

/**
 * Registers the local template filters.
 * @private
 * @param {Object} nunjucks Nunjucks environment.
 * @param {String} templateDir Directory where template is located.
 * @param {String} filtersDir Directory where local filters are located.
 */
function registerLocalFilters(nunjucks, templateDir, filtersDir) {
  return new Promise((resolve, reject) => {
    const localFilters = path.resolve(templateDir, filtersDir);

    if (!fs.existsSync(localFilters)) return resolve();

    const walker = xfs.walk(localFilters, {
      followLinks: false
    });

    walker.on('file', async (root, stats, next) => {
      try {
        const filePath = path.resolve(templateDir, path.resolve(root, stats.name));
        // If it's a module constructor, inject dependencies to ensure consistent usage in remote templates in other projects or plain directories.
        delete require.cache[require.resolve(filePath)];
        const mod = require(filePath);

        addFilters(nunjucks, mod);
        
        next();
      } catch (e) {
        reject(e);
      }
    });

    walker.on('errors', (root, nodeStatsArray) => {
      reject(nodeStatsArray);
    });

    walker.on('end', async () => {
      resolve();
    });
  });
}

/**
* Registers the additionally configured filters.
* @private
* @param {Object} nunjucks Nunjucks environment.
* @param {String} templateDir Directory where template is located.
* @param {Object} templateConfig Template configuration.
*/
async function registerConfigFilters(nunjucks, templateDir, templateConfig) {
  const confFilters = templateConfig.filters; 
  const DEFAULT_MODULES_DIR = 'node_modules';
  if (!Array.isArray(confFilters)) return;

  const promises = confFilters.map(async filtersModule => {
    let mod;
    let filterName = filtersModule;
    try {
      //first we try to grab module with filters by the module name
      //this is when generation is used on production using remote templates
      mod = require(filterName);
    } catch (error) {
      //in case template is local but was not installed in node_modules of the generator then we need to explicitly provide modules location
      try {
        filterName = path.resolve(templateDir, DEFAULT_MODULES_DIR, filtersModule);
        mod = require(filterName);
      } catch (e) {
        //sometimes it may happen that template is located in node_modules with other templates and its filter package is on the same level as template, as it is shared with other templates
        try {
          filterName = path.resolve(templateDir, '../..', filtersModule);
          mod = require(filterName);
        } catch (error) {
          //in rare cases, especially in isolated tests, it may happen that installation 
          //ends but is not yet fully completed, so initial require of the same path do not work
          //but in next attempt it works
          //we need to keep this workaround until we find a solution
          mod = require(filterName);
        }
      }
    }
    return addFilters(nunjucks, mod);
  });

  await Promise.all(promises);
}

/**
 * Add filter functions to Nunjucks environment. Only owned functions from the module are added.
 * @private
 * @param {Object} nunjucks Nunjucks environment.
 * @param {Object} filters Module with functions.
 */
function addFilters(nunjucks, filters) {
  Object.getOwnPropertyNames(filters).forEach((key) => {
    const value = filters[key];
    if (!(value instanceof Function)) return;

    if (isAsyncFunction(value)) {
      nunjucks.addFilter(key, value, true);
    } else {
      nunjucks.addFilter(key, value);
    }
  });      
}
