const path = require('path');
const { readFile } = require('../utils');
const log = require('loglevel');

const CONFIG_FILENAME = 'package.json';

/**
 * Loads template configuration from either .ageneratorrc or package.json
 * @param {string} templateDir - Path to the template directory
 * @returns {Promise<Object>} Template configuration object
 */
async function loadTemplateConfig(templateDir) {
  let templateConfig = {};

  // Try to load config from .ageneratorrc
  try {
    const rcConfigPath = path.resolve(templateDir, '.ageneratorrc');
    const yaml = await readFile(rcConfigPath, { encoding: 'utf8' });
    const yamlConfig = require('js-yaml').load(yaml);
    templateConfig = yamlConfig || {};

    log.debug('Template configuration loaded from .ageneratorrc');
    return templateConfig;
  } catch (rcError) {
    log.debug('Could not load .ageneratorrc file:', rcError);
    // Continue to try package.json if .ageneratorrc fails
  }

  // Try to load config from package.json
  try {
    const configPath = path.resolve(templateDir, CONFIG_FILENAME);
    const json = await readFile(configPath, { encoding: 'utf8' });
    const generatorProp = JSON.parse(json).generator;
    templateConfig = generatorProp || {};

    log.debug('Template configuration loaded from package.json');
  } catch (packageError) {
    log.debug('Could not load generator config from package.json:', packageError);
  }

  return templateConfig;
}

/**
 * Loads default values of parameters from template config
 * @param {Object} templateConfig - The template configuration object
 * @param {Object} templateParams - The template parameters object to modify
 */
function loadDefaultValues(templateConfig, templateParams) {
  const parameters = templateConfig.parameters;
  const defaultValues = Object.keys(parameters || {}).filter(key => parameters[key].default);

  defaultValues
    .filter(dv => templateParams[dv] === undefined)
    .forEach(dv => {
      Object.defineProperty(templateParams, dv, {
        enumerable: true,
        get() {
          return parameters[dv].default;
        }
      });
    });
}

module.exports = {
  loadTemplateConfig,
  loadDefaultValues
};