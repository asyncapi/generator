const path = require('path');
const baseConfig = require('../../../../../../jest.config.base');

// Why: Jest sets NODE_ENV=test, so react/jsx-runtime loads its dev build and warns about missing list keys.
// Use the prod runtime like real generation does; resolve via package.json since React 18+'s exports map hides ./cjs/*.
const jsxRuntimeProd = path.join(path.dirname(require.resolve('react/package.json')), 'cjs/react-jsx-runtime.production.min.js');

module.exports = {
  ...baseConfig(__dirname, { moduleNameMapper: { '^react/jsx-runtime$': jsxRuntimeProd } }),
  moduleFileExtensions: [
    'js',
    'json',
    'jsx'
  ],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
};

