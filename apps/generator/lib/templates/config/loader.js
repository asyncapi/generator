const path = require('path');
const { readFile } = require('../../utils');
const log = require('loglevel');
const yaml = require('js-yaml');

const PRIMARY_CONFIG_FILE = '.ageneratorrc';
const SECONDARY_CONFIG_FILE = 'package.json';

/** 
 * Loads the template configuration.
 * @async
 * @param {string} templateDir - Path to the template directory
 * @returns {Promise<Object>} Resolves with the loaded template configuration object
*/
async function loadTemplateConfig(templateDir) {
    let templateConfig = {};

    // Try to load config from .ageneratorrc
    try {
        const rcConfigPath = path.resolve(templateDir, PRIMARY_CONFIG_FILE);
        const rcContent = await readFile(rcConfigPath, { encoding: 'utf8' });
        const yamlConfig = yaml.load(rcContent);
        templateConfig = yamlConfig || {};
        return templateConfig;
    } catch (rcError) {
        // console.error('Could not load .ageneratorrc file:', rcError);
        log.debug('Could not load .ageneratorrc file:', rcError);
        // Continue to try package.json if .ageneratorrc fails
    }

    // Try to load config from package.json
    try {
        const configPath = path.resolve(templateDir, SECONDARY_CONFIG_FILE);
        const json = await readFile(configPath, { encoding: 'utf8' });
        const generatorProp = JSON.parse(json).generator;
        templateConfig = generatorProp || {};
    } catch (packageError) {
        // console.error('Could not load generator config from package.json:', packageError);
        log.debug('Could not load generator config from package.json:', packageError);
    }
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

    defaultValues.filter(dv => templateParams[dv] === undefined).forEach(dv =>
        Object.defineProperty(templateParams, dv, {
            enumerable: true,
            get: (() => {
                const key = dv;
                return function () {
                    return parameters[key].default;
                };
            })()
        })
    );
}

module.exports = {
    loadTemplateConfig,
    loadDefaultValues
};