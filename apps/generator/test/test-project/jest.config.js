const path = require('path');
const baseConfig = require('../../../../jest.config.base');

module.exports = {
  ...baseConfig(__dirname, {
    moduleNameMapper: {
      '^@asyncapi/nunjucks-filters$': path.resolve(__dirname, '../../../nunjucks-filters'),
      '^@asyncapi/generator-react-sdk$': path.resolve(__dirname, '../../../react-sdk'),
    },
  }),
};

