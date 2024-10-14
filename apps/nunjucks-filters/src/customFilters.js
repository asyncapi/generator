const Markdown = require('markdown-it');
const _ = require('lodash');
const OpenAPISampler = require('openapi-sampler');

const filter = module.exports;

/**
 * Turns Markdown into HTML
 * @md {string} - String with valid Markdown syntax
 * @returns {string} HTML string
 */
function markdown2html(md) {
  return Markdown().render(md || '');
}
filter.markdown2html = markdown2html;

/**
 * Logs input to server logs to stdout
 * @str  {string} Info that is logged
 */
function log(str) {
  console.log(str);
}
filter.log = log;

/**
 * Logs input to server as error to stderr
 * @str  {string} Info that is logged
 */
function logError(str) {
  console.error(str);
}
filter.logError = logError;

/**
 * Extracts example from the message payload
 * @msg {object} - Parser Message function
 * @returns {object}
 */
function getPayloadExamples(msg) {
  const examples = msg.examples();
  if (Array.isArray(examples) && examples.some(e => e.payload)) {
    // Instead of flat or flatmap use this.
    const messageExamples = _.flatMap(examples)
      .map(e => {
        if (!e.payload) return;
        return {
          name: e.name,
          summary: e.summary,
          example: e.payload,
        };
      })
      .filter(Boolean);

    if (messageExamples.length > 0) {
      return messageExamples;
    }
  }

  const payload = msg.payload();
  if (payload?.examples()) {
    return payload.examples().map(example => ({ example }));
  }
}
filter.getPayloadExamples = getPayloadExamples;

/**
 * Extracts example from the message header
 * @msg {object} - Parser Message function
 * @returns {object}
 */
function getHeadersExamples(msg) {
  const examples = msg.examples();
  if (Array.isArray(examples) && examples.some(e => e.headers)) {
    // Instead of flat or flatmap use this.
    const messageExamples = _.flatMap(examples)
      .map(e => {
        if (!e.headers) return;
        return {
          name: e.name,
          summary: e.summary,
          example: e.headers,
        };
      })
      .filter(Boolean);

    if (messageExamples.length > 0) {
      return messageExamples;
    }
  }

  const headers = msg.headers();
  if (headers?.examples()) {
    return headers.examples().map(example => ({ example }));
  }
}
filter.getHeadersExamples = getHeadersExamples;

/**
 * Generate string with example from provided schema
 * @schema {object} - Schema object as JSON and not Schema model map
 * @options {object} - Options object. Supported options are listed here https://github.com/Redocly/openapi-sampler#usage
 * @returns {string}
 */
function generateExample(schema, options) {
  return JSON.stringify(OpenAPISampler.sample(schema, options || {}) || '', null, 2);
}
filter.generateExample = generateExample;

/**
 * Turns multiline string into one liner
 * @str {string} - Any multiline string
 * @returns {string}
 */
function oneLine(str) {
  if (!str) return str;
  return str.replace(/\n/g, ' ');
}
filter.oneLine = oneLine;

/**
 * Generate JSDoc from message properties of the header and the payload
 *
 * @example
 * docline(
 *  Schema {
 *     _json: {
 *       type: 'integer',
 *       minimum: 0,
 *       maximum: 100,
 *       'x-parser-schema-id': '<anonymous-schema-3>'
 *     }
 *   },
 *   my-app-header,
 *   options.message.headers
 * )
 *
 * Returned value will be ->  * @param {integer} options.message.headers.my-app-header
 *
 * @field {object} - Property object
 * @fieldName {string} - Name of documented property
 * @scopePropName {string} - Name of param for JSDocs
 * @returns {string} JSDoc compatible entry
 */
function docline(field, fieldName, scopePropName) {
  /* eslint-disable sonarjs/cognitive-complexity */
  const getType = (f) => f.type() || 'string';
  const getDescription = (f) => f.description() ? ` - ${f.description().replace(/\r?\n|\r/g, '')}` : '';
  const getDefault = (f, type) => (f.default() && type === 'string') ? `'${f.default()}'` : f.default();
  const getPName = (pName) => pName ? `${pName}.` : '';

  const buildLineCore = (type, def, pName, fName) => {
    let paramName = `${pName}${fName}`;
    let defaultValue = def !== undefined ? `=${def}` : '';
    return `* @param {${type}} ${paramName}${defaultValue}`;
};

  const buildLine = (f, fName, pName) => {
    const type = getType(f);
    const def = getDefault(f, type);
    const line = buildLineCore(type, def, getPName(pName), fName);
    return line + (type === 'object' ? '' : getDescription(f));
  };

  const buildObjectLines = (f, fName, pName) => {
    const properties = f.properties();
    const mainLine = buildLine(f, fName, pName);

    return `${mainLine  }\n${  Object.keys(properties).map((propName) =>
      buildLine(properties[propName], propName, `${getPName(pName)}${fName}`)
    ).join('\n')}`;
  };

  return getType(field) === 'object'
    ? buildObjectLines(field, fieldName, scopePropName)
    : buildLine(field, fieldName, scopePropName);
}
filter.docline = docline;

/**
 * Helper function to replace server variables in the url with actual values
 * @url {string} - url string
 * @serverserverVariables {Object} - Variables model map
 * @returns {string}
 */
function replaceServerVariablesWithValues(url, serverVariables) {
  const getVariablesNamesFromUrl = (inputUrl) => {
    const result = [];
    let array = [];

    const regEx = /{([^}]+)}/g;

    while ((array = regEx.exec(inputUrl)) !== null) {
      result.push([array[0], array[1]]);
    }

    return result;
  };

  const getVariableValue = (object, variable) => {
    const keyValue = object[variable]._json;

    if (keyValue) return keyValue.default ?? keyValue.enum?.[0];
  };

  const urlVariables = getVariablesNamesFromUrl(url);
  const declaredVariables =
    urlVariables.filter(el => serverVariables.hasOwnProperty(el[1]));

  if (urlVariables.length !== 0 && declaredVariables.length !== 0) {
    let value;
    let newUrl = url;

    urlVariables.forEach(el => {
      value = getVariableValue(serverVariables, el[1]);

      if (value) {
        newUrl = newUrl.replace(el[0], value);
      }
    });
    return newUrl;
  }
  return url;
}

filter.replaceServerVariablesWithValues = replaceServerVariablesWithValues;
