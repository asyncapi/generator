const path = require('node:path');
const { mkdir, writeFile } = require('./utils');
const logMessage = require('./logMessages');

/**
 * Writes the original AsyncAPI document into the generation target directory.
 *
 * @param {Object} generator Generator instance.
 * @param {String} generator.originalAsyncAPI Original AsyncAPI document content.
 * @param {String} generator.targetDir Generation output directory.
 * @param {Object} generator.templateParams Template parameters.
 * @param {String} [generator.templateParams.asyncapiFileDir] Optional subdirectory within the generation output directory.
 * @returns {Promise<void>} Resolves after the AsyncAPI document is written.
 * @throws {Error} When asyncapiFileDir resolves outside targetDir, or when directory creation/file writing fails.
 */
async function createAsyncapiFile(generator) {
  const asyncapi = generator.originalAsyncAPI;
  const targetDir = generator.targetDir;
  const customDirInTarget = generator.templateParams?.asyncapiFileDir;
  const extension = getAsyncapiFileExtension(asyncapi);

  const outputFileName = `asyncapi.${extension}`;
  const outputDir = resolveOutputDir(targetDir, customDirInTarget);

  if (customDirInTarget) {
    await mkdir(outputDir, { recursive: true });
  }

  await writeFile(path.resolve(outputDir, outputFileName), asyncapi);
}

function getAsyncapiFileExtension(asyncapi) {
  try {
    JSON.parse(asyncapi);
    return 'json';
  } catch (_) {
    return 'yaml';
  }
}

function resolveOutputDir(targetDir, customDirInTarget) {
  const resolvedTargetDir = path.resolve(targetDir);

  if (!customDirInTarget) {
    return resolvedTargetDir;
  }

  const outputDir = path.resolve(resolvedTargetDir, customDirInTarget);
  const relativeOutputDir = path.relative(resolvedTargetDir, outputDir);

  if (relativeOutputDir.startsWith('..') || path.isAbsolute(relativeOutputDir)) {
    throw new Error(logMessage.asyncapiFileDirOutsideTarget(customDirInTarget));
  }

  return outputDir;
}

module.exports = {
  'generate:after': createAsyncapiFile
};
