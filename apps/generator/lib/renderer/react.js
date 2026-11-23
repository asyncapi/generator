const path = require('path');
const AsyncReactSDK = require('@asyncapi/generator-react-sdk');
const minimatch = require('minimatch');
const logMessage = require('../logMessages.js');
const log = require('loglevel');
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
 * Resolves the final file path and other metadata for a single rendered content item.
 *
 * @private
 * @param {TemplateRenderResult} renderedContent The react content rendered.
 * @param {String} outputPath Base path to the file being rendered.
 * @param {Array} noOverwriteGlobs Array of globs to skip overwriting files.
 * @returns {Object} An object containing filePath, content, permissions, and shouldOverwrite.
 */
const resolveFileMetadata = (renderedContent, outputPath, noOverwriteGlobs = []) => {
  let filePath = outputPath;
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

  const finalFileName = path.basename(filePath);
  const shouldOverwrite = !noOverwriteGlobs.some(globExp => minimatch(finalFileName, globExp));

  return {
    filePath,
    content,
    permissions,
    shouldOverwrite
  };
};

/**
 * Save the single rendered react content based on the meta data available.
 *
 * @private
 * @param {TemplateRenderResult} renderedContent the react content rendered
 * @param {String} outputPath Path to the file being rendered.
 */
const saveContentToFile = async (renderedContent, outputPath, noOverwriteGlobs = []) => {
  const { filePath, content, permissions, shouldOverwrite } = resolveFileMetadata(renderedContent, outputPath, noOverwriteGlobs);

  // Write the file only if it should not be skipped
  if (shouldOverwrite) {
    await writeFile(filePath, content, {
      mode: permissions
    });
  } else {
    await log.debug(logMessage.skipOverwrite(filePath));
  }
};

/**
 * Save the rendered react content based on the meta data available.
 *
 * If multiple rendered contents resolve to the same output path, an error is thrown.
 *
 * @private
 * @param {TemplateRenderResult[] | TemplateRenderResult} renderedContent the react content rendered
 * @param {String} outputPath Path to the file being rendered.
 * @param noOverwriteGlobs Array of globs to skip overwriting files.
 */
reactExport.saveRenderedReactContent = async (renderedContent, outputPath, noOverwriteGlobs = []) => {
  const contentsToProcess = Array.isArray(renderedContent) ? renderedContent : [renderedContent];
  const resolvedFiles = [];
  const filePathsSeen = new Set();

  for (const content of contentsToProcess) {
    const fileMetadata = resolveFileMetadata(content, outputPath, noOverwriteGlobs);

    if (filePathsSeen.has(fileMetadata.filePath)) {
      throw new Error(`Multiple template outputs resolve to the same file path: ${fileMetadata.filePath}. Please ensure all <File> components have unique 'name' props.`);
    }
    filePathsSeen.add(fileMetadata.filePath);
    resolvedFiles.push(fileMetadata);
  }

  return Promise.all(resolvedFiles.map(async ({ filePath, content, permissions, shouldOverwrite }) => {
    if (shouldOverwrite) {
      await writeFile(filePath, content, {
        mode: permissions
      });
    } else {
      await log.debug(logMessage.skipOverwrite(filePath));
    }
  }));
};
