module.exports = {
/**
  * Escapes pipe characters in a JSDoc type string for Markdown output.
  * `@param` {string | null | undefined} type
  * `@returns` {string | null | undefined}
  */
  escapeType: function(type) {
    return type ? type.replace(/\|/g, '&#124;') : type;
  }
};
