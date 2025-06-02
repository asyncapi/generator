const log = require('loglevel');
const logMessage = require('./logMessages');
const jmespath = require('jmespath');

/**
 * Determines whether the generation of a file or folder should be skipped
 * based on conditions defined in the template configuration.
 *
 * @param {Object} templateConfig - The template configuration containing conditional logic.
 * @param {string} matchedConditionPath - The matched path used to find applicable conditions.
 * @param {Object} templateParams - Parameters passed to the template.
 * @param {AsyncAPIDocument} asyncapiDocument - The AsyncAPI document used for evaluating conditions.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the condition is met, allowing the file or folder to render; otherwise, resolves to `false`. 
 */
async function isGenerationConditionMet (
  templateConfig,
  matchedConditionPath,
  templateParams,
  asyncapiDocument 
) {
  const conditionFilesGeneration = templateConfig?.conditionalFiles?.[matchedConditionPath] || {};
  const conditionalGeneration = templateConfig?.conditionalGeneration?.[matchedConditionPath] || {};

  const config = Object.keys(conditionFilesGeneration).length > 0 
    ? conditionFilesGeneration 
    : conditionalGeneration;

  const subject = config?.subject;

  // conditionalFiles becomes deprecated with this PR, and soon will be removed.
  // TODO: https://github.com/asyncapi/generator/issues/1553
  if (Object.keys(conditionFilesGeneration).length > 0 && subject) {
    return conditionalFilesGenerationDeprecatedVersion(
      asyncapiDocument,
      templateConfig,
      matchedConditionPath,
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
    return conditionalParameterGeneration(templateConfig,matchedConditionPath,templateParams);
  }
};

/**
 * Evaluates whether a template path should be conditionally generated 
 * based on a parameter defined in the template configuration.
 * @private
 * @async
 * @function conditionalParameterGeneration
 * @param {Object} templateConfig - The full template configuration object.
 * @param {string} matchedConditionPath - The path of the file/folder being conditionally generated.
 * @param {Object} templateParams - The parameters passed to the generator, usually user input or default values.
 * @returns {Promise<boolean>} - Resolves to `true` if the parameter passes validation, `false` otherwise.
 */
async function conditionalParameterGeneration(templateConfig, matchedConditionPath, templateParams) {
  const conditionalGenerationConfig = templateConfig.conditionalGeneration?.[matchedConditionPath];
  const parameterName = conditionalGenerationConfig.parameter;
  const parameterValue = templateParams[parameterName];
  return validateStatus(parameterValue, matchedConditionPath, templateConfig);
}

/**
 * Determines whether a file should be conditionally included based on the provided subject expression
 * and optional validation logic defined in the template configuration.
 * @private
 * @param {Object} asyncapiDocument - The parsed AsyncAPI document instance used for context evaluation.
 * @param {Object} templateConfig - The configuration object that contains `conditionalFiles` rules.
 * @param {string} matchedConditionPath - The path of the file/folder being conditionally generated.
 * @param {Object} templateParams - The parameters passed to the generator, usually user input or default values.
 * @returns {Boolean} - Returns `true` if the file should be included; `false` if it should be skipped.
 */
async function conditionalFilesGenerationDeprecatedVersion (
  asyncapiDocument,
  templateConfig,
  matchedConditionPath,
  templateParams
) {
  return conditionalSubjectGeneration(asyncapiDocument, templateConfig, matchedConditionPath, templateParams);
};

/**
 * Determines whether a file should be conditionally included based on the provided subject expression
 * and optional validation logic defined in the template configuration.
 * @private
 * @param {Object} asyncapiDocument - The parsed AsyncAPI document instance used for context evaluation.
 * @param {Object} templateConfig - The configuration object that contains `conditionalFiles` rules.
 * @param {String} matchedConditionPath - The relative path to the directory of the source file.
 * @param {Object} templateParams - Parameters passed to the template.
 * @returns {Boolean} - Returns `true` if the file should be included; `false` if it should be skipped.
 */
async function conditionalSubjectGeneration (
  asyncapiDocument,
  templateConfig,
  matchedConditionPath,
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
  return validateStatus(source, matchedConditionPath, templateConfig);
}

/**
 * Validates the argument value based on the provided validation schema.
 *
 * @param {any} argument The value to validate.
 * @param {String} matchedConditionPath The matched condition path.
 * @param {Object} templateConfig - The template configuration containing conditional logic.
 * @return {Promise<Boolean>} A promise that resolves to false if the generation should be skipped, true otherwise.
 */
async function validateStatus(
  argument,
  matchedConditionPath,
  templateConfig
) {
  const validation = templateConfig.conditionalGeneration?.[matchedConditionPath]?.validate || templateConfig.conditionalFiles?.[matchedConditionPath]?.validate;
  if (!validation) {
    return false; 
  }
 
  const isValid = validation(argument);

  if (!isValid) {
    if (templateConfig.conditionalGeneration?.[matchedConditionPath]) {
      log.debug(logMessage.conditionalGenerationMatched(matchedConditionPath));
    } else {
      // conditionalFiles becomes deprecated with this PR, and soon will be removed.
      // TODO: https://github.com/asyncapi/generator/issues/1553
      log.debug(logMessage.conditionalFilesMatched(matchedConditionPath));
    }
 
    return false;
  }
  return true;
}

module.exports = {
  isGenerationConditionMet
};