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
  if (Array.isArray(msg.examples()) && msg.examples().find(e => e.payload)) {
    // Instead of flat or flatmap use this.
    return _.flatMap(msg.examples().map(e => e.payload).filter(Boolean));
  }
  
  if (msg.payload() && msg.payload().examples()) {
    return msg.payload().examples();
  }
};
filter.getPayloadExamples = getPayloadExamples;

/**
 * Extracts example from the message header
 * @msg {object} - Parser Message function
 * @returns {object}
 */
function getHeadersExamples(msg) {
  if (Array.isArray(msg.examples()) && msg.examples().find(e => e.headers)) {
    // Instead of flat or flatmap use this.
    return _.flatMap(msg.examples().map(e => e.headers).filter(Boolean));
  }
  
  if (msg.headers() && msg.headers().examples()) {
    return msg.headers().examples();
  }
};
filter.getHeadersExamples = getHeadersExamples;

/**
 * Generate string with example from provided schema
 * @msg {object} - A OpenAPI Schema Object
 * @returns {string}
 */
function generateExample(schema) {
  return JSON.stringify(OpenAPISampler.sample(schema) || '', null, 2);
};
filter.generateExample = generateExample;

/**
 * Turns multiline string into one liner
 * @str {string} - Any multiline string
 * @returns {string}
 */
function oneLine(str) {
  if (!str) return str;
  return str.replace(/\n/g, ' ');
};
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
  const buildLine = (f, fName, pName) => {
    const type = f.type() ? f.type() : 'string';
    const description = f.description() ? ` - ${f.description().replace(/\r?\n|\r/g, '')}` : '';
    let def = f.default();

    if (def && type === 'string') def = `'${def}'`;

    let line;
    if (def !== undefined) {
      line = ` * @param {${type}} [${pName ? `${pName}.` : ''}${fName}=${def}]`;
    } else {
      line = ` * @param {${type}} ${pName ? `${pName}.` : ''}${fName}`;
    }

    if (type === 'object') {
      let lines = `${line}\n`;
      let first = true;
      for (const propName in f.properties()) {
        lines = `${lines}${first ? '' : '\n'}${buildLine(f.properties()[propName], propName, `${pName ? `${pName}.` : ''}${fName}`)}`;
        first = false;
      }
      return lines;
    }

    return `${line}${description}`;
  };

  return buildLine(field, fieldName, scopePropName);
};
filter.docline = docline;
