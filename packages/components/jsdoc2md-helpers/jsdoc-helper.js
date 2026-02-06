module.exports = {
/**
  * Escapes pipe characters in a JSDoc type string for Markdown output.
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
  */
  eq(a, b) {
    return a === b;
  },
};
