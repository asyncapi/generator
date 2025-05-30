const path = require('path');
const log = require('loglevel');
const { readFile } = require('../utils');

const CONFIG_FILENAME = 'package.json';

/**
 * Loads the template configuration.
 * @private
 */
async function loadTemplateConfig() {
  this.templateConfig = {};

  // Try to load config from .ageneratorrc
  try {
    const rcConfigPath = path.resolve(this.templateDir, '.ageneratorrc');
    const yaml = await readFile(rcConfigPath, { encoding: 'utf8' });
    const yamlConfig = require('js-yaml').load(yaml);
    this.templateConfig = yamlConfig || {};

    await loadDefaultValues.call(this);
    return;
  } catch (rcError) {
    log.debug('Could not load .ageneratorrc file:', rcError);
    // Continue to try package.json if .ageneratorrc fails
  }

  // Try to load config from package.json
  try {
    const configPath = path.resolve(this.templateDir, CONFIG_FILENAME);
    const json = await readFile(configPath, { encoding: 'utf8' });
    const generatorProp = JSON.parse(json).generator;
    this.templateConfig = generatorProp || {};
  } catch (packageError) {
    log.debug('Could not load generator config from package.json:', packageError);
  }

  await loadDefaultValues.call(this);
}

/**
 * Loads default values of parameters from template config. If value was already set as parameter it will not be
 * overriden.
 * @private
 */
async function loadDefaultValues() {
  const parameters = this.templateConfig.parameters;
  const defaultValues = Object.keys(parameters || {}).filter(key => parameters[key].default);

  defaultValues.filter(dv => this.templateParams[dv] === undefined).forEach(dv =>
    Object.defineProperty(this.templateParams, dv, {
      enumerable: true,
      get() {
        return parameters[dv].default;
      }
    })
  );
}

module.exports = {
  loadTemplateConfig,
  loadDefaultValues
};