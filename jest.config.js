module.exports = {
  clearMocks: true,
  moduleNameMapper: {
    '^nimma/legacy$': '<rootDir>/node_modules/nimma/dist/legacy/cjs/index.js',
    '^nimma/(.*)': '<rootDir>/node_modules/nimma/dist/cjs/$1',
    '^@stoplight/spectral-ruleset-bundler/(.*)$': '<rootDir>/node_modules/@stoplight/spectral-ruleset-bundler/dist/$1'
  },
};
