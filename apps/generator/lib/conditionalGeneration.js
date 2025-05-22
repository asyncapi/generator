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
 * @returns {Promise<boolean>} A promise that resolves to `true` if the generation completed, otherwise `false`.
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
  const validation = config?.validation;

  if (Object.keys(conditionFilesGeneration).length > 0 && subject) {
    return conditionalFilesGenerationDeprecatedVersion(
      asyncapiDocument,
      templateParams,
      templateConfig,
      relativeSourceFile
    );
  } else if (Object.keys(conditionalGeneration).length > 0 && subject) {
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

  return validateParameterValue(
    validation,
    parameterValue,
    matchedConditionPath,
    relativeSourceDirectory,
    relativeTargetFile,
    targetDir,
    templateConfig
  );
};

/**
 * Determines whether a file should be conditionally included based on the provided subject expression
 * and optional validation logic defined in the template configuration.
 *
 * @param {Object} asyncapiDocument - The parsed AsyncAPI document instance used for context evaluation.
 * @param {Object} templateParams - The template parameters passed by the user (e.g. server selection).
 * @param {Object} templateConfig - The configuration object that contains `conditionalFiles` rules.
 * @param {String} relativeSourceFile - The relative path to the source file being evaluated.
 * @param {String} relativeSourceDirectory - The relative path to the directory of the source file.
 * @returns {Boolean} - Returns `true` if the file should be included; `false` if it should be skipped.
 */
async function conditionalFilesGenerationDeprecatedVersion (
  asyncapiDocument,
  templateParams,
  templateConfig,
  relativeSourceFile
) {
  const fileCondition = templateConfig.conditionalFiles?.[relativeSourceFile];
  if (!fileCondition || !fileCondition.subject) {
    return true; 
  }

  const { subject, validate } = fileCondition;

  const server = templateParams.server && asyncapiDocument.servers().get(templateParams.server);
  const context = {
    ...asyncapiDocument.json(),
    server: server ? server.json() : undefined,
    info: asyncapiDocument.info()?.json(),
    channels: asyncapiDocument.channels() || undefined,
    components: asyncapiDocument.components()?.json(),
  };

  const source = jmespath.search(context, subject);
  let validateStatus = 'false';
  if (validate(source) === 'true') {
    validateStatus = true;
  }
  if (!source) {
    log.debug(logMessage.relativeSourceFileNotGenerated(relativeSourceFile, subject));
    return false;
  }

  if (validate && !validateStatus) {
    log.debug(logMessage.conditionalFilesMatched(relativeSourceFile));
    return false;
  }

  return true;
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
 * @returns {Boolean} - Returns `true` if the file should be included; `false` if it should be skipped.
 */
async function conditionalSubjectGeneration (
  asyncapiDocument,
  templateConfig,
  matchedConditionPath
) {
  const fileCondition = templateConfig.conditionalGeneration?.[matchedConditionPath];
  if (!fileCondition || !fileCondition.subject) {
    return true; 
  }

  const { subject } = fileCondition;

  const context = {
    ...asyncapiDocument.json(),
    server: asyncapiDocument.info()?.json(),
    info: asyncapiDocument.info()?.json(),
    channels: asyncapiDocument.channels() || undefined,
    components: asyncapiDocument.components()?.json(),
  };

  const source = jmespath.search(context, subject);
  
  if (!source) {
    log.debug(logMessage.relativeSourceFileNotGenerated(matchedConditionPath, subject));
    return false;
  } else
  if (source) {
    const validate = templateConfig.conditionalGeneration?.[matchedConditionPath].validate;
    const isValid = validate(source);
    if (isValid === 'false') {
      log.debug(logMessage.conditionalGenerationMatched(matchedConditionPath));
      return false;
    }
    return true;
  }
};
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
 * Validates the parameter value based on the provided validation schema.
 *
 * @param {Object} validation The validation schema to use.
 * @param {any} parameterValue The value to validate.
 * @param {String} matchedConditionPath The matched condition path.
 * @param {String} relativeSourceDirectory The relative path of the source directory.
 * @param {String} relativeTargetFile The relative path of the target file.
 * @param {String} targetDir The directory where the generated files are written.
 * @return {Promise<Boolean>} A promise that resolves to false if the generation should be skipped, true otherwise.
 */
async function validateParameterValue(
  validation,
  argument,
  matchedConditionPath,
  relativeSourceDirectory,
  relativeTargetFile,
  targetDir,
  templateConfig
) {
  const validate = templateConfig.conditionalGeneration?.[matchedConditionPath].validate;

  if (Object.hasOwn(validation, 'not')) {
    const isNotValid =  validate(argument);
    if (!isNotValid) { 
      log.debug(logMessage.conditionalGenerationMatched(matchedConditionPath));
      if (matchedConditionPath === relativeSourceDirectory) {
        await conditionNotMeet(relativeTargetFile, targetDir);
      }
      return false;
    }
    return true;
  }

  const isValid = validate(argument);

  if (!isValid) {
    log.debug(logMessage.conditionalGenerationMatched(matchedConditionPath));
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