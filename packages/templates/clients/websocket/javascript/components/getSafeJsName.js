import { toCamelCase } from '@asyncapi/generator-helpers';

/**
 * Converts a given string into a safe JavaScript identifier.
 * It camelCases the string, replaces invalid characters, ensures it does not start with a digit,
 * and avoids collisions with reserved words (including specific constructor parameters).
 *
 * @param {string} name - The original string (e.g., a query parameter name).
 * @returns {string} A safe JavaScript identifier.
 */
export function getSafeJSName(name) {
  let safe = toCamelCase(name);
  safe = safe.replace(/[^a-zA-Z0-9_]/g, '_');
  if ((/^[0-9]/).test(safe)) {
    safe = `_${safe}`;
  }
  const reserved = ['url', 'throwSendErrors', 'params', 'queryString', 'class', 'const', 'let', 'var', 'if', 'else', 'return', 'this', 'true', 'false', 'null', 'undefined'];
  if (reserved.includes(safe)) safe = `_${  safe}`;
  return safe;
}