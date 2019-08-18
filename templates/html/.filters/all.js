module.exports = (Nunjucks, _) => {
  Nunjucks.addFilter('split', (string, separator) => {
    if (typeof string !== 'string') return string;
    const regex = new RegExp(separator, 'g');
    return string.split(regex);
  });

  Nunjucks.addFilter('firstKey', (obj) => {
    if (!obj) return '';
    return Object.keys(obj)[0];
  });

  Nunjucks.addFilter('isExpandable', (obj) => {
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

  Nunjucks.addFilter('isArray', (arr) => {
    return Array.isArray(arr);
  });

  Nunjucks.addFilter('contains', (array, element) => {
    if (!array || !Array.isArray(array)) return false;
    return array.includes(element);
  });

  Nunjucks.addFilter('log', (anything) => {
    console.log(anything);
  });
};
