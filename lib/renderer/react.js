const path = require('path');
const AsyncReactSDK = require('asyncAPISDK');
const {
  writeFile
} = require('../utils');

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
 * @param {AsyncAPIDocument} asyncapiDocument 
 * @param {string} filePath path to the template file
 * @param {Object} extraTemplateData Extra data to pass to the template.
 * @param {string} templateLocation located for thetemplate
 * @param {string} templateContentDir where the template content are located
 * @param {string} transpiledTemplateLocation folder for the transpiled code
 * @param {Object} templateParams provided template parameters
 * @param {boolean} debug flag
 * @param {string} originalAsyncAPI 
 * @return {Promise<TemplateRenderResult>}
 */
reactExport.renderReact = async (asyncapiDocument, filePath, extraTemplateData, templateLocation, templateContentDir, transpiledTemplateLocation, templateParams, debug, originalAsyncAPI) => {
  extraTemplateData = extraTemplateData || {};
  filePath = filePath.replace(templateContentDir, path.resolve(templateLocation, transpiledTemplateLocation));
  return await AsyncReactSDK.renderTemplate(
    filePath, 
    {
      asyncapi: asyncapiDocument,
      params: templateParams,
      originalAsyncAPI,
      ...extraTemplateData
    }, 
    debug
  );
};

/**
 * Save the rendered react content based on the meta data available.
 * 
 * @private
 * @param {TemplateRenderResult} renderContent the react content rendered
 * @param {String} outputPath Path to the file being rendered.
 */
reactExport.saveRenderedReactContent = async (renderContent, outputPath) => {
  let filePath = outputPath;
  let permissions = 0o666;
  const content = renderContent.content;
  if (content === undefined || typeof content !== 'string') throw Error(`Template file not rendered correctly, was rendered as ${content}`);
  if (renderContent.metadata !== undefined) {
    if (renderContent.metadata.permissions !== undefined) {
      permissions = renderContent.metadata.permissions;
    }
    if (renderContent.metadata.fileName !== undefined) {
      const newFileName = renderContent.metadata.fileName.trim();
      const basepath = path.basename(filePath);
      filePath = filePath.replace(basepath, newFileName);
    }
  }
  await writeFile(filePath, content, {
    mode: permissions
  });
};
