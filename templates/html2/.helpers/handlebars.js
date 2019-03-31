module.exports = (Handlebars, _) => {

  Handlebars.registerHelper('concat', (str1, str2, separator) => {
    return `${str1 || ''}${separator || ''}${str2 || ''}`;
  });

  Handlebars.registerHelper('tree', path => {
    if (!path) return;

    const levels = path.split('.').length;
    let result = '';

    if (levels > 0) {
      result = '<span class="tree-space"></span>'.repeat(levels-1);
    }

    return `${result}<span class="tree-leaf"></span>`;
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

  Handlebars.registerHelper('contains', (array, element) => {
    if (!array) return false;
    return array.indexOf(element) >= 0;
  });

};
