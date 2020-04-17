const config = require('config');
const path = require('path');
const fs = require('fs');
const xfs = require('fs.extra');

module.exports.registerFilters = async (nunjucks, templateConfig, templateDir) => {
  registerConfigFilters(nunjucks, templateConfig);
  await registerLocalFilters(nunjucks, templateDir);
};
/**
   * Registers the template filters.
   * @private
   * @param {Object} nunjucks Nunjucks environment.
   * @param {String} templateDir Directory where template is located.
   */
function registerLocalFilters(nunjucks, templateDir) {
  return new Promise((resolve, reject) => {
    const filtersDir = config.get('FILTERS_DIRNAME');
    const localFilters = path.resolve(templateDir, filtersDir);

    if (!fs.existsSync(localFilters)) return resolve();

    const walker = xfs.walk(localFilters, {
      followLinks: false
    });

    walker.on('file', async (root, stats, next) => {
      try {
        const filePath = path.resolve(templateDir, path.resolve(root, stats.name));
        // If it's a module constructor, inject dependencies to ensure consistent usage in remote templates in other projects or plain directories.
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
* Registers the additinally configured filters.
* @private
* @param {Object} nunjucks Nunjucks environment.
* @param {Object} templateConfig Template configuration.
*/
function registerConfigFilters(nunjucks, templateConfig) {
  const confFilters = templateConfig.filters;
  if (!Array.isArray(confFilters)) return;
    
  confFilters.forEach(el => {
    const mod = require(el);
    addFilters(nunjucks, mod);
  });
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
    if (!value instanceof Function) return;

    nunjucks.addFilter(key, value);
  });      
}