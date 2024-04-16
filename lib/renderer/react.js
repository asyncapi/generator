const path = require('path');
const AsyncReactSDK = require('@asyncapi/generator-react-sdk');
const minimatch = require('minimatch');
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
 * @param {String[]} noOverwriteGlobs globs to check for files that should not be overwritten.
 */
const saveContentToFile = async (renderedContent, outputPath, noOverwriteGlobs) => {
  let filePath = outputPath;
  // Might be the same as in the `fs` package, but is an active choice for our default file permission for any rendered files.
  let permissions = 0o666;
  const content = renderedContent.content;

  // Error handling for undefined content or non-string type
  if (content === undefined || typeof content !== 'string') {
    throw Error(`Template file not rendered correctly, was rendered as ${content}`);
  }

  // Adjust file permissions based on metadata, if available
  if (renderedContent.metadata !== undefined) {
    if (renderedContent.metadata.permissions !== undefined) {
      permissions = renderedContent.metadata.permissions;
    }

    // Replace the base filename with a new filename from metadata if specified
    if (renderedContent.metadata.fileName !== undefined) {
      const newFileName = renderedContent.metadata.fileName.trim();
      const basepath = path.basename(filePath);
      filePath = filePath.replace(basepath, newFileName);
    }
  }

  // get the final file name of the file
  const finalFileName = path.basename(filePath);
  // check whether the filename should be ignored based on user's inputs
  const shouldOverwrite = !noOverwriteGlobs.some(globExp => minimatch(finalFileName, globExp));

  // Write the file only if it should not be skipped
  if (shouldOverwrite) {
    await writeFile(filePath, content, {
      mode: permissions
    });
  } else {
    console.log(`Skipping overwrite for: ${filePath}`);
  }
};

/**
 * Save the rendered react content based on the meta data available.
 *
 * @private
 * @param {TemplateRenderResult[] | TemplateRenderResult} renderedContent the react content rendered
 * @param {String} outputPath Path to the file being rendered.
 * @param {String[]} noOverwriteGlobs globs to check for files that should not be overwritten.
 */
reactExport.saveRenderedReactContent = async (renderedContent, outputPath, noOverwriteGlobs) => {
  // If the rendered content is an array, we need to save each file individually
  if (Array.isArray(renderedContent)) {
    return Promise.all(renderedContent.map(content => saveContentToFile(content, outputPath, noOverwriteGlobs)));
  }
  // Otherwise, we can save the single file
  return saveContentToFile(renderedContent, outputPath, noOverwriteGlobs);
};
