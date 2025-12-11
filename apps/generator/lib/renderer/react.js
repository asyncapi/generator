const path = require('path');
const AsyncReactSDK = require('@asyncapi/generator-react-sdk');
const logMessage = require('../logMessages.js');
const log = require('loglevel');
const {
  writeFileWithFiltering
} = require('../utils');

const reactExport = module.exports;

/**
 * Configures React templating system, this handles all the transpilation work.
 *
 * @private
 * @param {string} templateLocation located for thetemplate
 * @param {string} templateContentDir where the template content are located
 * @param {string} transpiledTemplateLocation folder for the transpiled code
 * @param {Boolean} compile Whether to compile the template files or used the cached transpiled version provided by the template in the '__transpiled' folder
 */
reactExport.configureReact = async (templateLocation, templateContentDir, transpiledTemplateLocation) => {
  const outputDir = path.resolve(templateLocation, `./${transpiledTemplateLocation}`);
  log.debug(logMessage.compileEnabled(templateContentDir, outputDir));
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
 * @param {String} targetDir Target directory for relative path calculations.
 */
const saveContentToFile = async (renderedContent, outputPath, noOverwriteGlobs = [], generateOnly = [], targetDir = process.cwd()) => {
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

  const written = await writeFileWithFiltering(
    filePath,
    content,
    { mode: permissions },
    targetDir,
    noOverwriteGlobs,
    generateOnly
  );

  return written ? 1 : 0;
};

/**
 * Save the rendered react content based on the meta data available.
 *
 * @private
 * @param {TemplateRenderResult[] | TemplateRenderResult} renderedContent the react content rendered
 * @param {String} outputPath Path to the file being rendered.
 * @param noOverwriteGlobs Array of globs to skip overwriting files.
 * @param generateOnly array of globs to specify which files should be generated.
 * @param targetDir target directory for relative path calculations.
 */
reactExport.saveRenderedReactContent = async (renderedContent, outputPath, noOverwriteGlobs = [], generateOnly = [], targetDir = process.cwd()) => {
  if (Array.isArray(renderedContent)) {
    const results = await Promise.all(renderedContent.map(content => saveContentToFile(content, outputPath, noOverwriteGlobs, generateOnly, targetDir)));
    return results.reduce((acc, val) => acc + (val || 0), 0);
  }
  return await saveContentToFile(renderedContent, outputPath, noOverwriteGlobs, generateOnly, targetDir);
};
