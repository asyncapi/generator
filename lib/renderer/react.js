const path = require('path');
const AsyncReactSDK = require('asyncAPISDK');

const reactExport = module.exports;

/**
 * Configures React templating system, this handles all the transpilation work.
 * 
 * @private
 * @param {string} templateLocation located for thetemplate
 * @param {string} templateContentDir where the template content are located
 * @param {string} transpiledTemplateLocation folder for the transpiled code
 */
reactExport.configureReact = async (templateLocation, templateContentDir, transpiledTemplateLocation) => {
  const outputDir = path.resolve(templateLocation, `./${transpiledTemplateLocation}`);
  await AsyncReactSDK.transpileFiles(templateContentDir, outputDir, {
    recursive: true
  });
};

/**
 * Renders the template with react and returns the content and meta data for the file.
 * 
 * @private
 * @param {import('@asyncapi/parser').AsyncAPIDocument} asyncapiDocument 
 * @param {string} filePath path to the template file
 * @param {Object} extraTemplateData Extra data to pass to the template.
 * @param {string} templateLocation located for thetemplate
 * @param {string} templateContentDir where the template content are located
 * @param {string} transpiledTemplateLocation folder for the transpiled code
 * @param {Object} templateParams provided template parameters
 * @param {boolean} debug flag
 * @param {string} originalAsyncAPI 
 * @return {Promise<import('asyncAPISDK').TemplateRenderResult>}
 */
reactExport.renderReact = async (asyncapiDocument, filePath, extraTemplateData = {}, templateLocation, templateContentDir, transpiledTemplateLocation, templateParams, debug, originalAsyncAPI) => {
  filePath = filePath.replace(templateContentDir, path.resolve(templateLocation, transpiledTemplateLocation));
  return await AsyncReactSDK.renderTemplate(
    filePath, 
    {
      asyncapi: asyncapiDocument,
      params: templateParams,
      originalAsyncAPI,
      ...extraTemplateData
    }, 
    debug);
};