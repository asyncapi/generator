const { isKeyword, isStrictBindReservedWord } = require('@babel/helper-validator-identifier');

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

const lowerFirst = (inputStr) => {
  return inputStr.charAt(0).toLowerCase() + inputStr.slice(1);
};

const upperFirst = (inputStr) => {
  return inputStr.charAt(0).toUpperCase() + inputStr.slice(1);
};

/**
 * Converts an AsyncAPI query parameter name into a safe JavaScript identifier.
 *
 * The function camelCases the input, strips invalid identifier characters,
 * prefixes with `_` when the result starts with a digit or is a JavaScript
 * keyword / strict-mode reserved word, and checks caller-supplied reserved
 * names the same way.
 *
 * **Collision detection:** when two different AsyncAPI names produce the same
 * identifier the function throws instead of silently renaming, so the user
 * gets a clear generation-time error rather than broken code.
 *
 * @param {string} name - The original AsyncAPI query parameter name.
 * @param {Map<string,string>} [usedNames=new Map()] - A Map whose keys are
 *   already-claimed identifiers and values are the original AsyncAPI names
 *   that produced them. The map is mutated (the new mapping is added).
 * @param {Set<string>} [reservedNames=new Set()] - An optional set of
 *   additional names that should be treated as reserved (e.g. constructor
 *   parameter names like `url` or `throwSendErrors`).
 * @returns {string} A safe JavaScript identifier.
 * @throws {Error} When `name` cannot produce a valid JavaScript identifier,
 *   or when two different AsyncAPI names collide on the same identifier.
 */
const getSafeJSName = (name, usedNames = new Map(), reservedNames = new Set()) => {
  let safe = toCamelCase(name);

  // Why: toCamelCase strips most non-identifier chars, but a few edge cases
  // (e.g. lone non-ASCII symbols) can slip through — clean them out.
  safe = safe.replace(/[^a-zA-Z0-9_$]/g, '');

  if (safe.length === 0) {
    throw new Error(
      `Cannot generate JavaScript client: query parameter "${name}" cannot be converted to a valid JavaScript identifier.`
    );
  }

  if ((/^[0-9]/).test(safe)) {
    safe = `_${safe}`;
  }

  // Why: isKeyword covers all ES2015+ keywords (break, class, const, …).
  // isStrictBindReservedWord covers strict-mode bindings (eval, arguments,
  // implements, interface, let, package, private, protected, public, static,
  // yield) plus literals (true, false, null) and future-reserved words (enum).
  // Why: inModule=false (omitted) is intentional — the generated client is CJS,
  // where `await` is a valid identifier. Passing true would over-restrict.
  if (isKeyword(safe) || isStrictBindReservedWord(safe)) {
    safe = `_${safe}`;
  }

  if (reservedNames.has(safe)) {
    safe = `_${safe}`;
  }

  if (usedNames.has(safe)) {
    const previousName = usedNames.get(safe);
    throw new Error(
      `Cannot generate JavaScript client: query parameters "${previousName}" and "${name}" both produce "${safe}".`
    );
  }
  usedNames.set(safe, name);

  return safe;
};

module.exports = {
  getClientName,
  getTitle,
  getInfo,
  toSnakeCase,
  toCamelCase,
  lowerFirst,
  upperFirst,
  getSafeJSName
};
