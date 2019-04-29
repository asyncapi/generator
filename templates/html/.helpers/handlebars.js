module.exports = (Handlebars, _) => {

  Handlebars.registerHelper('concat', (str1, str2, separator) => {
    return `${str1 || ''}${separator || ''}${str2 || ''}`;
  });

  Handlebars.registerHelper('equal', (lvalue, rvalue) => {
    return lvalue === rvalue;
  });

  Handlebars.registerHelper('inc', (number) => {
    return number + 1;
  });

  Handlebars.registerHelper('not', (bool) => {
    return !bool;
  });

  Handlebars.registerHelper('log', (something) => {
    console.log(require('util').inspect(something, { depth: null }));
  });

  Handlebars.registerHelper('contains', (array, element) => {
    if (!array) return false;
    return array.indexOf(element) >= 0;
  });

  Handlebars.registerHelper('join', (array, separator) => {
    if (!array || !Array.isArray(array)) return '';
    return array.join(separator);
  });

  Handlebars.registerHelper('firstKey', (obj) => {
    if (!obj) return '';
    return Object.keys(obj)[0];
  });

  Handlebars.registerHelper('stringify', (obj) => {
    return JSON.stringify(obj);
  });

  Handlebars.registerHelper('isExpandable', (obj) => {
    if (
      obj.type === 'object' ||
      obj.type === 'array' ||
      obj.oneOf ||
      obj.anyOf ||
      obj.items ||
      obj.additionalItems ||
      obj.properties ||
      obj.additionalProperties ||
      obj.patternProperties
    ) return true;

    return false;
  });

  Handlebars.registerHelper('isArray', (arr) => {
    return Array.isArray(arr);
  });

  Handlebars.registerHelper('array', function () {
    return Array.prototype.slice.call(arguments, 0, -1);
  });

  Handlebars.registerHelper('in', (arr, needle) => {
    if (!Array.isArray(arr)) return false;
    return arr.includes(needle);
  });
};
