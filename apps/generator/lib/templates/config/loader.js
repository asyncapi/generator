const path = require('path');
const { readFile } = require('../../utils');
const log = require('loglevel');
const yaml = require('js-yaml');

const PRIMARY_CONFIG_FILE = '.ageneratorrc';
const SECONDARY_CONFIG_FILE = 'package.json';

/** 
 * Loads the template configuration and applies default values to template parameters.
 * @async
 * @param {string} templateDir - Path to the template directory
 * @param {Object} templateParams - Template parameters object to populate with defaults
 * @returns {Promise<Object>} Resolves with the loaded template configuration object
*/
async function loadTemplateConfig(templateDir, templateParams) {
    let templateConfig = {};

    // Try to load config from .ageneratorrc
    try {
        const rcConfigPath = path.resolve(templateDir, PRIMARY_CONFIG_FILE);
        const rcContent = await readFile(rcConfigPath, { encoding: 'utf8' });
        const yamlConfig = yaml.load(rcContent);
        templateConfig = yamlConfig || {};
    } catch (rcError) {
        log.debug('Could not load .ageneratorrc file:', rcError);
        // Try to load config from package.json
        try {
            const configPath = path.resolve(templateDir, SECONDARY_CONFIG_FILE);
            const json = await readFile(configPath, { encoding: 'utf8' });
            const generatorProp = JSON.parse(json).generator;
            templateConfig = generatorProp || {};
        } catch (packageError) {
            log.debug('Could not load generator config from package.json:', packageError);
        }
    }
    loadDefaultValues(templateConfig, templateParams);
    return templateConfig;
}

/**
 * Loads default values of parameters from template config. If value was already set as parameter it  will not be overriden.
 * @param  {Object} templateConfig Template configuration.
 * @param  {Object} templateParams Params specified when running generator.
 * @returns {void}
 */
function loadDefaultValues(templateConfig, templateParams) {
    const parameters = templateConfig.parameters;
    const defaultValues = Object.keys(parameters || {}).filter(key => parameters[key].default);

    defaultValues.filter(dv => !Object.prototype.hasOwnProperty.call(templateParams, dv)).forEach(dv =>
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