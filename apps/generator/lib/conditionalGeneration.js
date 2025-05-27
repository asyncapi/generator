const fs = require('fs').promises;
const path = require('path');
const log = require('loglevel');
const logMessage = require('./logMessages');
const jmespath = require('jmespath');

/**
 * Determines whether the generation of a file or folder should be skipped
 * based on conditions defined in the template configuration.
 *
 * @param {string} relativeSourceFile - The relative path of the source file.
 * @param {string} relativeSourceDirectory - The relative path of the source directory.
 * @param {string} relativeTargetFile - The relative path of the target file to be generated.
 * @param {Object} templateConfig - The template configuration containing conditional logic.
 * @param {string} targetDir - The directory where the generated files are written.
 * @param {string} matchedConditionPath - The matched path used to find applicable conditions.
 * @param {Object} templateParams - Parameters passed to the template.
 * @param {AsyncAPIDocument} asyncapiDocument - The AsyncAPI document used for evaluating conditions.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the condition is met, allowing the file or folder to render; otherwise, resolves to `false`. 
 */
async function isGenerationConditionMet (
  relativeSourceFile,
  relativeSourceDirectory,
  relativeTargetFile,
  templateConfig,
  targetDir,
  matchedConditionPath,
  templateParams,
  asyncapiDocument 
) {
  const conditionFilesGeneration = templateConfig?.conditionalFiles?.[matchedConditionPath] || {};
  const conditionalGeneration = templateConfig?.conditionalGeneration?.[matchedConditionPath] || {};

  const config = Object.keys(conditionFilesGeneration).length > 0 
    ? conditionFilesGeneration 
    : conditionalGeneration;
  
  const parameter = config?.parameter;
  const subject = config?.subject;

  // conditionalFiles becomes deprecated with this PR, and soon will be removed.
  // TODO: https://github.com/asyncapi/generator/issues/1553
  if (Object.keys(conditionFilesGeneration).length > 0 && subject) {
    return conditionalFilesGenerationDeprecatedVersion(
      asyncapiDocument,
      templateConfig,
      relativeSourceFile,
      relativeTargetFile,
      targetDir,
      templateParams
    );
  } else if (Object.keys(conditionalGeneration).length > 0) {
    // Case when the subject is present in conditionalGeneration
    if (subject) {
      return conditionalSubjectGeneration(
        asyncapiDocument,
        templateConfig,
        matchedConditionPath
      );
    }
   
    const parameterValue = await getParameterValue(templateParams, parameter);

    if (parameterValue === undefined) {
      await handleMissingParameterValue(matchedConditionPath, templateConfig);
      return false;
    }
    // Case when the parameter is present in conditionalGeneration
    return validateStatus(
      parameterValue,
      matchedConditionPath,
      relativeSourceDirectory,
      relativeTargetFile,
      targetDir,
      templateConfig
    );
  }
};

/**
 * Determines whether a file should be conditionally included based on the provided subject expression
 * and optional validation logic defined in the template configuration.
 *
 * @param {Object} asyncapiDocument - The parsed AsyncAPI document instance used for context evaluation.
 * @param {Object} templateConfig - The configuration object that contains `conditionalFiles` rules.
 * @param {String} relativeSourceFile - The relative path to the source file being evaluated.
 * @param {String} relativeSourceDirectory - The relative path to the directory of the source file.
 * @param {string} relativeTargetFile - The relative path of the target file to be generated.
 * @param {string} targetDir - The directory where the generated files are written.
 * @param {Object} templateParams - Parameters passed to the template.
 * @returns {Boolean} - Returns `true` if the file should be included; `false` if it should be skipped.
 */
async function conditionalFilesGenerationDeprecatedVersion (
  asyncapiDocument,
  templateConfig,
  relativeSourceFile,
  relativeSourceDirectory,
  relativeTargetFile,
  targetDir,
  templateParams
) {
  return conditionalSubjectGeneration(asyncapiDocument, templateConfig, relativeSourceFile, relativeSourceDirectory, relativeTargetFile, targetDir, templateParams);
};

/**
 * Asynchronously removes the parent directory of the specified target file, 
 * if it exists and is a directory.
 *
 * @param {string} relativeTargetFile - The relative path to the target file, used to locate its parent directory.
 * @param {string} targetDir - The base directory where the target file resides.
 * @returns {Promise<void>} A promise that resolves when the parent directory is removed, or if it does not exist.
 */
const conditionNotMeet = async (relativeTargetFile, targetDir) => {
  const fullFilePath = path.join(targetDir, relativeTargetFile);
  const parentDir = path.dirname(fullFilePath);

  try {
    const stats = await fs.lstat(parentDir);
    if (stats.isDirectory()) {
      await fs.rm(parentDir, { recursive: true, force: true });
    }
  } catch (error) {
    // Ignore error if the directory does not exist
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
};

/**
 * Determines whether a file should be conditionally included based on the provided subject expression
 * and optional validation logic defined in the template configuration.
 *
 * @param {Object} asyncapiDocument - The parsed AsyncAPI document instance used for context evaluation.
 * @param {Object} templateConfig - The configuration object that contains `conditionalFiles` rules.
 * @param {String} matchedConditionPath - The relative path to the directory of the source file.
 * @param {String} relativeSourceDirectory - The relative path to the directory of the source file.
 * @param {string} relativeTargetFile - The relative path of the target file to be generated.
 * @param {string} targetDir - The directory where the generated files are written.
 * @param {Object} templateParams - Parameters passed to the template.
 * @returns {Boolean} - Returns `true` if the file should be included; `false` if it should be skipped.
 */
async function conditionalSubjectGeneration (
  asyncapiDocument,
  templateConfig,
  matchedConditionPath,
  relativeSourceDirectory,
  relativeTargetFile,
  targetDir,
  templateParams

) {
  const fileCondition = templateConfig.conditionalGeneration?.[matchedConditionPath] || templateConfig.conditionalFiles?.[matchedConditionPath];
  
  if (!fileCondition || !fileCondition.subject) {
    return true; 
  }

  const { subject } = fileCondition;

  const server = templateParams.server && asyncapiDocument.servers().get(templateParams.server);

  const source = jmespath.search({
    ...asyncapiDocument.json(),
    ...{
      server: server ? server.json() : undefined,
    },
  }, subject);
  
  if (!source) {
    log.debug(logMessage.relativeSourceFileNotGenerated(matchedConditionPath, subject));
    return false;
  } 

  return validateStatus(source, matchedConditionPath, relativeSourceDirectory, relativeTargetFile, targetDir, templateConfig);
}

/**
 * Handles the case where the parameter value is missing for conditional file generation.
 *
 * @private
 * @param {String} relativeSourceFile The relative path of the source file.
 */
async function handleMissingParameterValue(relativeSourceFile,templateConfig) {
  const parameter = templateConfig.conditionalGeneration?.[relativeSourceFile]?.parameter;
  log.debug(logMessage.relativeSourceFileNotGenerated(relativeSourceFile, parameter));
}

/**

/**
 * Validates the argument value based on the provided validation schema.
 *
 * @param {any} argument The value to validate.
 * @param {String} matchedConditionPath The matched condition path.
 * @param {String} relativeSourceDirectory The relative path of the source directory.
 * @param {String} relativeTargetFile The relative path of the target file.
 * @param {String} targetDir The directory where the generated files are written.
 * @param {Object} templateConfig - The template configuration containing conditional logic.
 * @return {Promise<Boolean>} A promise that resolves to false if the generation should be skipped, true otherwise.
 */
async function validateStatus(
  argument,
  matchedConditionPath,
  relativeSourceDirectory,
  relativeTargetFile,
  targetDir,
  templateConfig
) {
  const validateStatus = templateConfig.conditionalGeneration?.[matchedConditionPath]?.validate || templateConfig.conditionalFiles?.[matchedConditionPath]?.validate;

  const isValid = validateStatus(argument);

  if (!isValid) {
    if (templateConfig.conditionalGeneration?.[matchedConditionPath]) {
      log.debug(logMessage.conditionalGenerationMatched(matchedConditionPath));
    } else {
      // conditionalFiles becomes deprecated with this PR, and soon will be removed.
      // TODO: https://github.com/asyncapi/generator/issues/1553
      log.debug(logMessage.conditionalFilesMatched(matchedConditionPath));
    }
    if (matchedConditionPath === relativeSourceDirectory) {
      await conditionNotMeet(relativeTargetFile, targetDir);
    }
    return false;
  }
  return true;
}

/**
 * Retrieves the value of a specified parameter from the template parameters object.
 *
 * @param {Object} templateParams - The object containing parameters, typically derived from an AsyncAPI document.
 * @param {string} parameter - The name of the parameter to retrieve.
 * @returns {*} The value of the specified parameter, or undefined if the parameter does not exist.
 */
async function getParameterValue(templateParams, parameter) {
  return templateParams[parameter];
}

module.exports = {
  isGenerationConditionMet
};