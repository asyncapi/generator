const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig(__dirname),
  moduleFileExtensions: [
    'js',
    'json',
    'jsx'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
};

