module.exports = ({ Nunjucks, _ }) => {
  Nunjucks.addFilter('dump', object => {
    return JSON.stringify(object);
  });

  Nunjucks.addFilter('wrapValue', (value, type) => {
    if (type === 'string') {
      return '"' + value + '"';
    } else {
      return value;
    }
  });

  Nunjucks.addFilter('upperCamelCase', (str) => {
    return _.chain(str).camelCase().upperFirst().value();
  });

  Nunjucks.addFilter('translateType', (type, format) => {
    switch(type) {
      case 'integer':
        if (format && format === 'int64')
          return 'long';
        else
          return 'int';
      case 'string':
        if (format && format === 'byte')
          return 'bytes';
        else
          return 'string';
      case 'boolean':
        return 'boolean';
      case 'number':
        if (format && format === 'double')
          return 'double';
        else
          return 'float';
      default:
        return 'null';
    }
  });
};
