const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const log = require('loglevel');
const logMessage = require('./logMessages');
const jmespath = require('jmespath');
/**
 * Determines if file generation should be skipped based on templateConfig conditions.
 *
 * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use for condition evaluation.
 * @param  {String} relativeSourceFile Relative path of the source file.
 * @param  {String} relativeSourceDirectory Relative path of the source directory.
 * @param  {String} relativeTargetFile Relative path of the target file to be generated.
 * @param  {Object} templateConfig Template configuration.
 * @param  {String} targetDir Directory where the generated files are written.
 * @return {Promise<Boolean>} Returns true if generation should be skipped.
 */
async function conditionalGeneration (
  relativeSourceFile,
  relativeSourceDirectory,
  relativeTargetFile,
  templateConfig,
  targetDir,
  matchedConditionPath,
  templateParams,
  asyncapiDocument 
) {
  const conditionConfig = templateConfig?.conditionalGeneration?.[matchedConditionPath] || {};
  const { parameter, subject, validation } = conditionConfig;
  
  if (subject) {
    return await module.exports.conditionalFiles(
      asyncapiDocument,
      templateParams,
      templateConfig,
      relativeSourceFile
    );
  }
  const parameterValue = getParameterValue(templateParams, parameter);
  if (!parameterValue) {
    handleMissingParameterValue(relativeSourceFile, templateConfig);
    return false;
  }

  return validateParameterValue(
    validation,
    parameterValue,
    matchedConditionPath,
    relativeSourceDirectory,
    relativeTargetFile,
    targetDir
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
async function conditionalFiles (
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
  if (!source) {
    log.debug(logMessage.relativeSourceFileNotGenerated(relativeSourceFile, subject));
    return false;
  }

  if (validate && !validate(source)) {
    log.debug(logMessage.conditionalFilesMatched(relativeSourceFile));
    return false;
  }

  return true;
};

/**
 * Handles the case where the parameter value is missing for conditional file generation.
 *
 * @private
 * @param {String} relativeSourceFile The relative path of the source file.
 */
function handleMissingParameterValue(relativeSourceFile,templateConfig) {
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
 * @return {Promise<Boolean>} A promise that resolves to true if the generation should be skipped.
 */
async function validateParameterValue(
  validation,
  argument,
  matchedConditionPath,
  relativeSourceDirectory,
  relativeTargetFile,
  targetDir
) {
  if (Object.hasOwn(validation, 'not')) {
    const isNotValid = validateNot(validation.not, argument);
    if (isNotValid && (matchedConditionPath === relativeSourceDirectory)) {
      await removeParentDirectory(relativeTargetFile, targetDir);
      return false;
    } else 
    if (isNotValid && (matchedConditionPath === relativeTargetFile)) {
      return false;
    }
    log.debug(logMessage.conditionalFilesMatched(matchedConditionPath));
    return true;
  }

  const ajv = new Ajv();
  const validate = ajv.compile(validation);
  const isValid = validate(argument);

  if (!isValid) {
    log.debug(logMessage.conditionalFilesMatched(matchedConditionPath));
    return true;
  } else 
  if (isValid && (matchedConditionPath === relativeTargetFile)) {
    return false;
  }
  
  await removeParentDirectory(relativeTargetFile, targetDir);
  return false;
}

/**
 * Validates the parameter value using a "not" schema.
 *
 * @param {Object} notSchema The "not" schema to use for validation.
 * @param {any} parameterValue The value to validate.
 * @return {Boolean} Returns true if validation fails, false otherwise.
 */
function validateNot(notSchema, parameterValue) {
  const ajv = new Ajv();
  const validateNot = ajv.compile(notSchema);
  return validateNot(parameterValue);
}

/**
 * Removes the parent directory of the specified target file if it exists and is a directory.
 *
 * @param {String} relativeTargetFile The relative path of the target file used to determine the parent directory.
 * @param {String} targetDir The directory where the generated files are written.
 * @return {Promise<void>} A promise that resolves once the parent directory is removed (if applicable).
 */
function removeParentDirectory(relativeTargetFile, targetDir) {
  const fullFilePath = path.join(targetDir, relativeTargetFile);
  const parentDir = path.dirname(fullFilePath);

  if (fs.existsSync(parentDir)) {
    const stats = fs.lstatSync(parentDir);
    if (stats.isDirectory()) {
      fs.rmdirSync(parentDir, { recursive: true });
    }
  }
}

/**
 * Retrieves the parameter value from the AsyncAPI document.
 *
 * @param {AsyncAPIDocument} asyncapiDocument The AsyncAPI document to extract the parameter value from.
 * @param {String} parameter The parameter name to retrieve.
 * @return {any} The value of the parameter.
 */
function getParameterValue(templateParams, parameter) {
  return templateParams[parameter];
}

module.exports = {
  conditionalGeneration,
  conditionalFiles
};