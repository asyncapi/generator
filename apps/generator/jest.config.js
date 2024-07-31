const path = require('path');
module.exports = {
  clearMocks: true,
  moduleNameMapper: {
    '^nimma/legacy$': '<rootDir>../../node_modules/nimma/dist/legacy/cjs/index.js',
    '^nimma/(.*)': '<rootDir>../../node_modules/nimma/dist/cjs/$1',
    '^@asyncapi/nunjucks-filters$': path.resolve(__dirname, '../nunjucks-filters'),
  },
};
