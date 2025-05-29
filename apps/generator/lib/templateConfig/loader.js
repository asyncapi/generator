const path = require('path');
const fs = require('fs');
const log = require('loglevel');
const { readFile } = require('../utils');

const CONFIG_FILENAME = 'package.json';

/**
 * Loads the template configuration from either .ageneratorrc or package.json
 * 
 * @param {String} templateDir Path to the template directory
 * @param {Object} templateParams Template parameters to be used for default values
 * @returns {Promise<Object>} The loaded template configuration
 */
async function loadTemplateConfig(templateDir, templateParams) {
  let templateConfig = {};
  try {
    const rcConfigPath = path.resolve(templateDir, '.ageneratorrc');
    const yaml = await readFile(rcConfigPath, { encoding: 'utf8' });
    const yamlConfig = require('js-yaml').load(yaml);
    templateConfig = yamlConfig || {};

    await loadDefaultValues(templateConfig, templateParams);
    return templateConfig;
  } catch (rcError) {
    log.debug('Could not load .ageneratorrc file:', rcError);
  }

  try {
    const configPath = path.resolve(templateDir, CONFIG_FILENAME);
    const json = await readFile(configPath, { encoding: 'utf8' });
    const generatorProp = JSON.parse(json).generator;
    templateConfig = generatorProp || {};
  } catch (packageError) {
    log.debug('Could not load generator config from package.json:', packageError);
  }

  await loadDefaultValues(templateConfig, templateParams);
  return templateConfig;
}

/**
 * Loads default values of parameters from template config. If value was already set as parameter it will not be
 * overriden.
 * 
 * @param {Object} templateConfig 
 * @param {Object} templateParams
 * @returns {Promise<void>}
 */
async function loadDefaultValues(templateConfig, templateParams) {
  const parameters = templateConfig.parameters;
  const defaultValues = Object.keys(parameters || {}).filter(key => parameters[key].default);

  defaultValues.filter(dv => templateParams[dv] === undefined).forEach(dv =>
    Object.defineProperty(templateParams, dv, {
      enumerable: true,
      get() {
        return parameters[dv].default;
      }
    })
  );
}

module.exports = {
  loadTemplateConfig
}; 