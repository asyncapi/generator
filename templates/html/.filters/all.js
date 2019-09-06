module.exports = ({ Nunjucks, Markdown, OpenAPISampler }) => {
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
      obj.type() === 'object' ||
      obj.type() === 'array' ||
      (obj.oneOf() && obj.oneOf().length) ||
      (obj.anyOf() && obj.anyOf().length) ||
      obj.items() ||
      obj.additionalItems() ||
      (obj.properties() && Object.keys(obj.properties()).length) ||
      obj.additionalProperties() ||
      obj.patternProperties()
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

  Nunjucks.addFilter('markdown2html', (md) => {
    return Markdown().render(md || '');
  });

  Nunjucks.addFilter('getPayloadExamples', (msg) => {
    if (Array.isArray(msg.examples()) && msg.find(e => e.payload)) {
      return msg.filter(e => e.payload);
    }

    if (msg.payload() && msg.payload().examples()) {
      return msg.payload().examples();
    }
  });

  Nunjucks.addFilter('getHeadersExamples', (msg) => {
    if (Array.isArray(msg.examples()) && msg.find(e => e.headers)) {
      return msg.filter(e => e.headers);
    }

    if (msg.headers() && msg.headers().examples()) {
      return msg.headers().examples();
    }
  });

  Nunjucks.addFilter('generateExample', (schema) => {
    return JSON.stringify(OpenAPISampler.sample(schema) || '', null, 2);
  });
};
