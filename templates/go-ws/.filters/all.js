const URL = require('url');
const path = require('path');

module.exports = ({ Nunjucks, _ }) => {
  Nunjucks.addFilter('path', (url, defaultPath) => {
    const parsed = URL.parse(url);
    return parsed.path || defaultPath || '/';
  });

  Nunjucks.addFilter('port', (url, defaultPort) => {
    const parsed = URL.parse(url);
    return parsed.port || defaultPort || 80;
  });

  Nunjucks.addFilter('pathResolve', (pathName, basePath = '/') => {
    return path.resolve(basePath, pathName);
  });

  Nunjucks.addFilter('camelCase', (string) => {
    return _.camelCase(string);
  });

  Nunjucks.addFilter('kebabCase', (string) => {
    return _.kebabCase(string);
  });

  Nunjucks.addFilter('upperFirst', (string) => {
    return _.upperFirst(string);
  });
};
