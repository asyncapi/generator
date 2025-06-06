const semver = require('semver');
const Ajv = require('ajv');
const { getGeneratorVersion } = require('../utils');
const levenshtein = require('levenshtein-edit-distance');
// eslint-disable-next-line no-unused-vars
const {AsyncAPIDocumentInterface, AsyncAPIDocument} = require('@asyncapi/parser');
const { usesNewAPI } = require('../parser');

const ajv = new Ajv({ allErrors: true });

// See https://github.com/asyncapi/parser-api
const supportedParserAPIMajorVersions = [
  'v1',
  'v2',
  'v3'
];

/**
 * Validates the template configuration.
 *
 * @param  {Object} templateConfig Template configuration.
 * @param  {Object} templateParams Params specified when running generator.
 * @param  {AsyncAPIDocumentInterface | AsyncAPIDocument} asyncapiDocument AsyncAPIDocument object to use as source.
 * @return {Boolean}
 */
module.exports.validateTemplateConfig = (templateConfig, templateParams, asyncapiDocument) => {
  // conditionalFiles becomes deprecated with this PR, and soon will be removed.
  // TODO: https://github.com/asyncapi/generator/issues/1553
  const { parameters, supportedProtocols, conditionalFiles, conditionalGeneration, generator, apiVersion } = templateConfig;

  // conditionalFiles becomes deprecated with this PR, and soon will be removed.
  // TODO: https://github.com/asyncapi/generator/issues/1553
  validateConditionalFiles(conditionalFiles);
  validateConditionalGeneration(conditionalGeneration);
  isTemplateCompatible(generator, apiVersion);
  isRequiredParamProvided(parameters, templateParams);
  isProvidedTemplateRendererSupported(templateConfig);
  if (asyncapiDocument && templateParams.server) {
    let server;
    if (usesNewAPI(templateConfig)) {
      server = asyncapiDocument.servers().get(templateParams.server);
    } else {
      server = asyncapiDocument.servers()[templateParams.server];
    }
    isServerProtocolSupported(server, supportedProtocols, templateParams.server);
    isServerProvidedInDocument(server, templateParams.server);
  }

  isProvidedParameterSupported(parameters, templateParams);
  return true;
};

/**
 * Checks if template is compatible with the version of the generator that is used
 * @private
 * @param {String} generator Information about supported generator version that is part of the template configuration
 * @param {String} generator Information about supported Parser-API version that is part of the template configuration
 */
function isTemplateCompatible(generator, apiVersion) {
  const generatorVersion = getGeneratorVersion();
  if (typeof generator === 'string' && !semver.satisfies(generatorVersion, generator, {includePrerelease: true})) {
    throw new Error(`This template is not compatible with the current version of the generator (${generatorVersion}). This template is compatible with the following version range: ${generator}.`);
  }

  if (typeof apiVersion === 'string' && !supportedParserAPIMajorVersions.includes(apiVersion)) {
    throw new Error(`The version specified in apiVersion is not supported by this Generator version. Supported versions are: ${supportedParserAPIMajorVersions.join(', ')}`);
  }
}

/**
 * Checks if parameters described in template configuration as required are passed to the generator
 * @private
 * @param {Object} configParams Parameters specified in template configuration
 * @param {Object} templateParams All parameters provided to generator
 */
function isRequiredParamProvided(configParams, templateParams) {
  const missingParams = Object.keys(configParams || {})
    .filter(key => configParams[key].required && !templateParams[key]);

  if (missingParams.length) {
    throw new Error(`This template requires the following missing params: ${missingParams}.`);
  }
}

/**
 * Provides a hint for a user about correct parameter name.
 * @private
 * @param {Object} wrongParam Incorrectly written parameter
 * @param {Object} configParams Parameters specified in template configuration
 */
function getParamSuggestion(wrongParam, configParams) {
  const sortInt = (a, b) => {
    return a[0] - b[0];
  };
  return Object.keys(configParams).map(param => [levenshtein(wrongParam, param), param]).sort(sortInt)[0][1];
}

/**
 * Checks if parameters provided to generator is supported by the template
 * @private
 * @param {Object} configParams Parameters specified in template configuration
 * @param {Object} templateParams All parameters provided to generator
 */
function isProvidedParameterSupported(configParams, templateParams) {
  const wrongParams = Object.keys(templateParams || {}).filter(key => !configParams?.[key]);

  if (!wrongParams.length) return;
  if (!configParams) throw new Error('This template doesn\'t have any params.');

  let suggestionsString = '';

  wrongParams.forEach(wp => {
    suggestionsString += `\nDid you mean "${getParamSuggestion(wp,configParams)}" instead of "${wp}"?`;
  });

  throw new Error(`This template doesn't have the following params: ${wrongParams}.${suggestionsString}`);
}

/**
 * Checks if given AsyncAPI document has servers with protocol that is supported by the template
 * @private
 * @param {Object} server Server object from AsyncAPI file
 * @param {String[]} supportedProtocols Supported protocols specified in template configuration
 * @param {String} paramsServerName Name of the server specified as a param for the generator
 */
function isServerProtocolSupported(server, supportedProtocols, paramsServerName) {
  if (server && Array.isArray(supportedProtocols) && !supportedProtocols.includes(server.protocol())) {
    throw new Error(`Server "${paramsServerName}" uses the ${server.protocol()} protocol but this template only supports the following ones: ${supportedProtocols}.`);
  }
}

/**
 * Checks if the the provided renderer are supported (no renderer are also supported, defaults to nunjucks)
 *
 * @param  {Object} templateConfig Template configuration.
 */
function isProvidedTemplateRendererSupported(templateConfig) {
  const supportedRenderers = [undefined, 'react', 'nunjucks'];
  if (supportedRenderers.includes(templateConfig.renderer)) {
    return;
  }

  throw new Error(`We do not support '${templateConfig.renderer}' as a renderer for a template. Only 'react' or 'nunjucks' are supported.`);
}

/**
 * Checks if given AsyncAPI document has servers with protocol that is supported by the template
 * @private
 * @param {Object} server Server object from AsyncAPI file
 * @param {String} paramsServerName Name of the server specified as a param for the generator
 */
function isServerProvidedInDocument(server, paramsServerName) {
  if (typeof paramsServerName === 'string' && !server) throw new Error(`Couldn't find server with name ${paramsServerName}.`);
}

// conditionalFiles becomes deprecated with this PR, and soon will be removed.
// TODO: https://github.com/asyncapi/generator/issues/1553
/**
 * Checks if conditional files are specified properly in the template
 * @private
 * @param {Object} conditionalFiles conditions specified in the template config
 */
function validateConditionalFiles(conditionalFiles) {
  if (typeof conditionalFiles === 'object') {
    const fileNames = Object.keys(conditionalFiles);

    fileNames.forEach(fileName => {
      const def = conditionalFiles[fileName];
      if (typeof def.subject !== 'string') throw new Error(`Invalid conditional file subject for ${fileName}: ${def.subject}.`);
      if (typeof def.validation !== 'object') throw new Error(`Invalid conditional file validation object for ${fileName}: ${def.validation}.`);
      conditionalFiles[fileName].validate = ajv.compile(conditionalFiles[fileName].validation);
    });
  }
}

/**
 * Validates conditionalGeneration settings in the template config.
 * @private
 * @param {Object} conditionalGeneration - The conditions specified in the template config.
 */
function validateConditionalGeneration(conditionalGeneration) {
  if (!conditionalGeneration || typeof conditionalGeneration !== 'object') return;
  
  for (const [fileName, def] of Object.entries(conditionalGeneration)) {
    const { subject, parameter, validation } = def;
    if (subject && typeof subject !== 'string')
      throw new Error(`Invalid 'subject' for ${fileName}: ${subject}`);
    if (parameter && typeof parameter !== 'string')
      throw new Error(`Invalid 'parameter' for ${fileName}: ${parameter}`);
    if (subject && parameter)
      throw new Error(`Both 'subject' and 'parameter' cannot be defined for ${fileName}`);
    if (typeof validation !== 'object')
      throw new Error(`Invalid 'validation' object for ${fileName}: ${validation}`);
    def.validate = ajv.compile(validation);
  }
}