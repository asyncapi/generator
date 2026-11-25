// Why: resolved server values are interpolated into generated Java source, so a
// raw quote, backslash, or line break would break the emitted string literal.
const CONTROL_CHARACTER_ESCAPES = {
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r'
};

/**
 * Serialize a value as a double-quoted Java string literal.
 *
 * @param {string} [value] - Value to serialize.
 *
 * @returns {string} A Java string literal, including the surrounding quotes.
 */
export function toJavaStringLiteral(value) {
  const escaped = String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/[\u0000-\u001f\u007f]/g, (char) =>
      CONTROL_CHARACTER_ESCAPES[char] || `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`
    );

  return `"${escaped}"`;
}
