module.exports = {
/**
  * Escapes HTML and Markdown-sensitive characters in a JSDoc type string for Markdown output.
  * @param {string|null|undefined} type - Raw JSDoc type string.
  * @returns {string|null|undefined} Escaped string or original falsy value.
  */
  escapeType(type) {
    if (!type) return type;

    return type
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\|/g, '&#124;')
      .replace(/\{/g, '&#123;')
      .replace(/\}/g, '&#125;');
  },
  /**
  * Equality helper for Handlebars templates
  * Strict equality helper for Handlebars templates.
  * @param {*} a - First value to compare.
  * @param {*} b - Second value to compare.
  * @returns {boolean} True if a === b.
   */
  eq(a, b) {
    return a === b;
  },
};
