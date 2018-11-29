module.exports = (Handlebars, _) => {

//capitalizeFirstLetter
  Handlebars.registerHelper('capitalize', (str) => {
    return _.capitalize(str);
  });

  Handlebars.registerHelper('camelCase', (str) => {
    return _.camelCase(str);
  });

  Handlebars.registerHelper('upperFirst', (str) => {
    return _.upperFirst(str);
  });

//convert string to java constant format: lightMeasuredPublish -> LIGHT_MEASURED_PUBLISH
  Handlebars.registerHelper('javaConst', (str) => {
    return _.snakeCase(str).toUpperCase();
  });

  Handlebars.registerHelper('compare', (lvalue, operator, rvalue, options) => {
    if (arguments.length < 4) throw new Error('Handlerbars Helper "compare" needs 3 parameters');

    const operators = {
      '==': (l,r) => { return l == r; },
      '===': (l,r) => { return l === r; },
      '!=': (l,r) => { return l != r; },
      '<': (l,r) => { return l < r; },
      '>': (l,r) => { return l > r; },
      '<=': (l,r) => { return l <= r; },
      '>=': (l,r) => { return l >= r; },
      typeof: (l,r) => { return typeof l === r; }
    };

    if (!operators[operator]) throw new Error(`Handlerbars Helper 'compare' doesn't know the operator ${operator}`);
    const result = operators[operator](lvalue,rvalue);

    if (result) return options.fn(this);

    return options.inverse(this);
  });

  // Handlebars.registerHelper('json', function(context) {
  //   return JSON.stringify(context);
  // });
  
  Handlebars.registerHelper('schemeExists', (collection, scheme) => {
    return _.some(collection, {'scheme': scheme});
  });
};
