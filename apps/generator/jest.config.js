const baseConfig = require('../../jest.config.base');

module.exports = {
  ...baseConfig(__dirname),
  clearMocks: true,
  moduleNameMapper: {
    '^@asyncapi/generator-react-sdk$': '<rootDir>/../react-sdk/lib',
    '^@asyncapi/generator-components$': '<rootDir>/../../packages/components/lib',
    ...baseConfig(__dirname).moduleNameMapper,
  },
};
