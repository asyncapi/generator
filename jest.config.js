module.exports = {
  clearMocks: true,
  modulePathIgnorePatterns: ["./__mocks__(?!/loglevel.js)"],
  moduleNameMapper: {
    '^nimma/legacy$': '<rootDir>/node_modules/nimma/dist/legacy/cjs/index.js',
    '^nimma/(.*)': '<rootDir>/node_modules/nimma/dist/cjs/$1',
  },
};
