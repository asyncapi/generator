import { toCamelCase } from '@asyncapi/generator-helpers';

/**
 * Converts a given string into a safe JavaScript identifier.
 * It camelCases the string, replaces invalid characters, ensures it does not start with a digit,
 * and avoids collisions with reserved words (including specific constructor parameters).
 *
 * @param {string} name - The original string (e.g., a query parameter name).
 * @param {Set<string>} [usedNames=new Set()] - A set of already used names to prevent collisions.
 * @returns {string} A safe JavaScript identifier.
 */
export function getSafeJSName(name, usedNames = new Set()) {
  let safe = toCamelCase(name);

  safe = safe.replace(/[^a-zA-Z0-9_$]/g, '_');
  if ((/^[0-9]/).test(safe)) {
    safe = `_${safe}`;
  }

  const JS_RESERVED_WORDS = new Set([
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'let',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
    'true',
    'false',
    'null',
    'enum',
    'implements',
    'interface',
    'package',
    'private',
    'protected',
    'public',
    'static',
    'arguments',
    'eval'
  ]);

  const RESERVED_NAMES = new Set([
    'url',
    'throwSendErrors',
    'params',
    'queryString'
  ]);

  if (JS_RESERVED_WORDS.has(safe) || RESERVED_NAMES.has(safe)) {
    safe = `_${safe}`;
  }
  
  let candidate = safe;
  let suffix = 1;
  while (usedNames.has(candidate)) {
    candidate = `${safe}_${suffix++}`;
  }
  usedNames.add(candidate);
  
  return candidate;
}