/**
 * Validate and retrieve the AsyncAPI info object from an AsyncAPI document.
 *
 * Throws an error if the provided AsyncAPI document has no `info` section.
 *
 * @param {object} asyncapi - The AsyncAPI document object.
 * @returns {object} The validated info object from the AsyncAPI document.
 */
const getInfo = (asyncapi) => {
  if (!asyncapi) {
    throw new Error('Make sure you pass AsyncAPI document as an argument.');
  }
  if (!asyncapi.info) {
    throw new Error('Provided AsyncAPI document doesn\'t contain Info object.');
  }
  const info = asyncapi.info();
  if (!info) {
    throw new Error('AsyncAPI document info object cannot be empty.');
  }
  return info;
};

/**
 * Validate and retrieve the AsyncAPI title parameter in the info object.
 *
 * Throws an error if the provided AsyncAPI info object lacks a `title` parameter.
 *
 * @param {object} asyncapi - The AsyncAPI document object.
 * @throws {Error} When `title` is `null` or `undefined` or `empty string`  .
 * @returns {string} The retrieved `title` parameter.
 */
const getTitle = asyncapi => {
  const info = getInfo(asyncapi);
  if (!info.title) {
    throw new Error('Provided AsyncAPI document info field doesn\'t contain title.');
  }
  const title = info.title();
  if (title === '') {
    throw new Error('AsyncAPI document title cannot be an empty string.');
  }
  
  return title;
};
/**
 * Get client name from AsyncAPI info.title or uses a custom name if provided.
 *
 * @param {object} info - The AsyncAPI info object.
 * @param {boolean} appendClientSuffix - Whether to append "Client" to the generated name
 * @param {string} [customClientName] - Optional custom client name to use instead of generating from title
 * 
 * @returns {string} The formatted client name, either the custom name or a generated name based on the title
 */
const getClientName = (asyncapi, appendClientSuffix, customClientName) => {
  if (customClientName) {
    return customClientName;
  }
  const title = getTitle(asyncapi);
  const baseName = `${title.replace(/\s+/g, '') // Remove all spaces
    .replace(/^./, char => char.toUpperCase())}`; // Make the first letter uppercase
  return appendClientSuffix ? `${baseName}Client` : baseName;
};

/**
 * Convert a camelCase or PascalCase string to snake_case.
 * If the string is already in snake_case, it will be returned unchanged.
 * 
 * @param {string} camelStr - The string to convert to snake_case
 * @returns {string} The converted snake_case string
 */
const toSnakeCase = (inputStr) => {
  return inputStr
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('_');
};

const toCamelCase = (inputStr) => {
  return inputStr
    .replace(/[^a-zA-Z0-9]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
    .replace(/^./, (match) => match.toLowerCase());
};

module.exports = {
  getClientName,
  getTitle,
  getInfo,
  toSnakeCase,
  toCamelCase
};
