
const Nunjucks = require('nunjucks');

const nunjucksExport = module.exports;

/**
 * Configures Nunjucks templating system
 * @private
 */
nunjucksExport.configureNunjucks = (debug, templateDir) => {
  const config = {};
  if (debug) config.dev = true;

  return new Nunjucks.Environment(new Nunjucks.FileSystemLoader(templateDir), config);
};

/**
 * Renders the template with nunjucks and returns a string.
 *
 * @private
 * @param {AsyncAPIDocument} asyncapiDocument AsyncAPI document to pass to the template.
 * @param {String} filePath Path to the file being rendered.
 * @param {Object} [extraTemplateData] Extra data to pass to the template.
 * @return {Promise}
 */
nunjucksExport.renderNunjucks = (asyncapiDocument, tempalteString, filePath, extraTemplateData, templateParams, originalAsyncAPI, nunjucks) => {
  return new Promise((resolve, reject) => {
    nunjucks.renderString(tempalteString, {
      asyncapi: asyncapiDocument,
      params: templateParams,
      originalAsyncAPI,
      ...extraTemplateData
    }, { path: filePath }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
