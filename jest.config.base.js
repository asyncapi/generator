const path = require('path');

/**
 * Base Jest configuration for the AsyncAPI Generator monorepo.
 * This provides shared configuration, particularly for the nimma module mapping.
 * 
 * @param {string} dirname - The __dirname of the package using this config
 * @param {object} options - Additional configuration options
 * @param {object} options.moduleNameMapper - Additional moduleNameMapper entries to merge
 * @returns {object} Jest configuration object
 */
module.exports = (dirname, options = {}) => {
  const repoRoot = __dirname;
  const relativePath = path.relative(dirname, repoRoot);
  const nodeModulesPath = relativePath ? `${relativePath}/node_modules` : 'node_modules';

  return {
    moduleNameMapper: {
      '^nimma/legacy$': `<rootDir>/${nodeModulesPath}/nimma/dist/legacy/cjs/index.js`,
      '^nimma/(.*)': `<rootDir>/${nodeModulesPath}/nimma/dist/cjs/$1`,
      ...(options.moduleNameMapper || {}),
    },
  };
};

