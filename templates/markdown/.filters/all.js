module.exports = (Nunjucks, _) => {

  Nunjucks.addFilter('log', anything => {
    console.log(anything);
  });

  Nunjucks.addFilter('tree', path => {
    const filteredPaths = path.split('.').filter(Boolean);
    if (!filteredPaths.length) return;
    const dottedPath = filteredPaths.join('.');

    return `${dottedPath}.`;
  });

  Nunjucks.addFilter('buildPath', (propName, path) => {
    if (!path) return propName;
    return `${path}.${propName}`;
  });

  Nunjucks.addFilter('isRequired', (obj, key) => {
    return obj && obj.required && !!(obj.required.includes(key));
  });

  Nunjucks.addFilter('acceptedValues', items => {
    if (!items) return '<em>Any</em>';

    return items.map(i => `<code>${i}</code>`).join(', ');
  });

};
