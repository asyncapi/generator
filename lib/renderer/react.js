const path = require('path');
const AsyncReactSDK = require('asyncAPISDK');

const reactExport = module.exports;
/**
 * Configures React templating system, this handles all the transpilation work.
 * @private
 */
reactExport.configureReact = async (templateLocation, templateContentDir, transpiledTemplateLocation) => {
  const outputDir = path.resolve(templateLocation, `./${transpiledTemplateLocation}`);
  await AsyncReactSDK.transpileFiles(templateContentDir, outputDir, {
    recursive: true
  });
};

/**
 * Renders the template with react and returns the  
 * @private
 * @param {AsyncAPIDocument} asyncapiDocument AsyncAPI document to pass to the template.
 * @param {String} filePath Path to the file being rendered.
 * @param {Object} [extraTemplateData] Extra data to pass to the template.
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