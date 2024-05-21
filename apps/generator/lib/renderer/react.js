const path = require('path');
const AsyncReactSDK = require('@asyncapi/generator-react-sdk');
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
 * Save the single rendered react content based on the meta data available.
 * 
 * @private
 * @param {TemplateRenderResult} renderedContent the react content rendered
 * @param {String} outputPath Path to the file being rendered.
 */
const saveContentToFile = async (renderedContent, outputPath) => {
  let filePath = outputPath;
  // Might be the same as in the `fs` package, but is an active choice for our default file permission for any rendered files. 
  let permissions = 0o666;
  const content = renderedContent.content;

  if (content === undefined || typeof content !== 'string') {
    throw Error(`Template file not rendered correctly, was rendered as ${content}`);
  }
  if (renderedContent.metadata !== undefined) {
    if (renderedContent.metadata.permissions !== undefined) {
      permissions = renderedContent.metadata.permissions;
    }
    if (renderedContent.metadata.fileName !== undefined) {
      const newFileName = renderedContent.metadata.fileName.trim();
      const basepath = path.basename(filePath);
      filePath = filePath.replace(basepath, newFileName);
    }
  }

  await writeFile(filePath, content, {
    mode: permissions
  });
};

/**
 * Save the rendered react content based on the meta data available.
 * 
 * @private
 * @param {TemplateRenderResult[] | TemplateRenderResult} renderedContent the react content rendered
 * @param {String} outputPath Path to the file being rendered.
 */
reactExport.saveRenderedReactContent = async (renderedContent, outputPath) => {
  if (Array.isArray(renderedContent)) {
    return Promise.all(renderedContent.map(content => saveContentToFile(content, outputPath)));
  }
  return saveContentToFile(renderedContent, outputPath);
};
