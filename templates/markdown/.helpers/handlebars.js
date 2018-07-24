const Handlebars = require('handlebars');

Handlebars.registerHelper('concat', (str1, str2, separator) => {
  return `${str1 || ''}${separator || ''}${str2 || ''}`;
});

Handlebars.registerHelper('tree', path => {
  const filteredPaths = path.split('.').filter(Boolean);
  if (!filteredPaths.length) return;
  const dottedPath = filteredPaths.join('.');

  return `${dottedPath}.`;
});

Handlebars.registerHelper('buildPath', (propName, path, key) => {
  if (!path) return propName;
  return `${path}.${propName}`;
});

Handlebars.registerHelper('isRequired', (obj, key) => {
  return obj && obj.required && !!(obj.required.includes(key));
});

Handlebars.registerHelper('acceptedValues', items => {
  if (!items) return '<em>Any</em>';

  return items.map(i => `<code>${i}</code>`).join(', ');
});

Handlebars.registerHelper('equal', (lvalue, rvalue, options) => {
  if (arguments.length < 3)
    throw new Error('Handlebars Helper equal needs 2 parameters');
  if (lvalue!==rvalue) {
    return options.inverse(this);
  }

  return options.fn(this);
});

Handlebars.registerHelper('inc', (number) => {
  return number + 1;
});

Handlebars.registerHelper('log', (something) => {
  console.log(require('util').inspect(something, { depth: null }));
});
