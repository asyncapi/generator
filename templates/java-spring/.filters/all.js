const _ = require('lodash');

module.exports = ({ Nunjucks }) => {
  Nunjucks.addFilter('camelCase', (str) => {
    return _.camelCase(str);
  });

  Nunjucks.addFilter('upperFirst', (str) => {
    return _.upperFirst(str);
  });

  Nunjucks.addFilter('schemeExists', (collection, scheme) => {
    return _.some(collection, {'scheme': scheme});
  });
};
