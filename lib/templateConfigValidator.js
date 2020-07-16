const semver = require('semver');
const Ajv = require('ajv');
const { getGeneratorVersion } = require('./utils');
const levenshtein = require('levenshtein-edit-distance');

const ajv = new Ajv({ allErrors: true });

/**
   * Validates the template configuration.
   *
   * @param  {Object} templateConfig Template configuration.
   * @param  {Object} templateParams Params specified when running generator.
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPIDocument object to use as source.
   * @return {Boolean}
   */
module.exports.validateTemplateConfig = (templateConfig, templateParams, asyncapiDocument) => {
  const { parameters, supportedProtocols, conditionalFiles, generator } = templateConfig;
  
  validateConditionalFiles(conditionalFiles);
  isTemplateCompatible(generator);

  isRequiredParamProvided(parameters, templateParams);

  if (asyncapiDocument) {
    const server = asyncapiDocument.server(templateParams.server);
    isServerProvidedInDocument(server, templateParams.server);
    isServerProtocolSupported(server, supportedProtocols, templateParams.server);
  }

  isProvidedParameterSupported(parameters, templateParams);

  return true;
};

/**
 * Checks if template is compatible with the version of the generator that is used
 * @private
 * @param {String} generator Information about supported generator version that is part of the template configuration
 */
function isTemplateCompatible(generator) {
  const generatorVersion = getGeneratorVersion();
  if (typeof generator === 'string' && !semver.satisfies(generatorVersion, generator, {includePrerelease: true})) {
    throw new Error(`This template is not compatible with the current version of the generator (${generatorVersion}). This template is compatible with the following version range: ${generator}.`);
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
  const arr = Object.keys(configParams).map(param => [levenshtein(wrongParam, param), param]);

  return arr.sort(sortInt)[0][1];
}

/**
 * Checks if parameters provided to generator is supported by the template
 * @private
 * @param {Object} configParams Parameters specified in template configuration
 * @param {Object} templateParams All parameters provided to generator 
 */
function isProvidedParameterSupported(configParams, templateParams) {
  const wrongParams = Object.keys(templateParams || {}).filter(key => !configParams || !configParams[key]);
  
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
 * Checks if given AsyncAPI document has servers with protocol that is supported by the template
 * @private
 * @param {Object} server Server object from AsyncAPI file
 * @param {String} paramsServerName Name of the server specified as a param for the generator
 */
function isServerProvidedInDocument(server, paramsServerName) {
  if (typeof paramsServerName === 'string' && !server) throw new Error(`Couldn't find server with name ${paramsServerName}.`);
}

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