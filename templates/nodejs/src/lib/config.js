const path = require('path');
const YAMLConfig = require('node-yaml-config');
const dotenv = require('dotenv');
const config = YAMLConfig.load(path.join(__dirname, '../../config/common.yml'));
const env = process.env;
dotenv.config();
overrideWithEnvVars(config);

/**
 * Overrides a config object with the values from environment variables, if found.
 *
 * @param {Object} cfg Config object
 * @param {String} prefix Key prefix
 */
function overrideWithEnvVars(cfg, prefix) {
  prefix = prefix || '';
  for (const key in cfg) {
    const fullKey = prefix + key.toUpperCase();

    if (typeof cfg[key] === 'object' && !Array.isArray(cfg[key]) && cfg[key] !== null) {
      overrideWithEnvVars(cfg[key], `${fullKey}_`);
    } else {
      if (!(fullKey in env)) continue;

      let value = env[fullKey];

      if (typeof cfg[key] === 'boolean') {
        value = value === 'true';
      } else if (typeof cfg[key] === 'number') {
        value = parseInt(value, 10);
      } else if (Array.isArray(cfg[key])) {
        value = JSON.parse(value);
      }

      cfg[key] = value;
    }
  }
}

module.exports = config;
