const semver = require('semver');
const packageJson = require('../package.json');
const Ajv = require('ajv');

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

  isTemplateCompatible(generator);

  isRequiredParamProvided(templateParams, parameters);

  validateConditionalFiles(conditionalFiles);

  if (asyncapiDocument) {
    const server = asyncapiDocument.server(templateParams.server);
    isServerProvidedInDocument(server, templateParams.server);
    isServerProtocolSupported(server, supportedProtocols, templateParams.server);
  }

  return true;
};

/**
 * Checks if template is compatible with the version of the generator that is used
 * @private
 * @param {String} generator Information about supported generator version that is part of the template configuration
 */
function isTemplateCompatible(generator) {
  if (typeof generator === 'string' && !semver.satisfies(packageJson.version, generator)) {
    throw new Error(`This template is not compatible with the current version of the generator (${packageJson.version}). This template is compatible with the following version range: ${generator}.`);
  }  
}

/**
 * Checks if parameters described in template configuration as required are passed to the generator
 * @private
 * @param {Object} templateParams All parameters provided to generator 
 * @param {Object} parameters Parameters specified in template configuration
 */
function isRequiredParamProvided(templateParams, parameters) {
  if (!parameters) return;

  const requiredParams = Object.keys(parameters || {}).filter(key => parameters[key].required === true);
  const missingParams = requiredParams.filter(rp => !templateParams[rp]);

  if (missingParams.length) {
    throw new Error(`This template requires the following missing params: ${missingParams}.`);
  }
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
    const fileNames = Object.keys(conditionalFiles) || [];
    fileNames.forEach(fileName => {
      const def = conditionalFiles[fileName];
      if (typeof def.subject !== 'string') throw new Error(`Invalid conditional file subject for ${fileName}: ${def.subject}.`);
      if (typeof def.validation !== 'object') throw new Error(`Invalid conditional file validation object for ${fileName}: ${def.validation}.`);
      conditionalFiles[fileName].validate = ajv.compile(conditionalFiles[fileName].validation);
    });
  }
}