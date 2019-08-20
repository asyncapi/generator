const path = require('path');
const yamlConfig = require('node-yaml-config');

const config = yamlConfig.load(path.join(__dirname, '../../config/common.yml'));

module.exports = config;
