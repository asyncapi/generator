/**
 * Type of indentation to use
 * @readonly
 * @enum {string}
 * @property {string}  TABS   - indicate to use tabs as separator
 * @property {string}  SPACES - indicate to use spaces as separator  
 */
export enum IndentationTypes {
  TABS = 'tabs',
  SPACES = 'spaces',
}

/**
 * Ensures indentations are prepended to content.
 * @private
 * @param {string} content to prepend the indentation
 * @param {number} size the number of indendations to use
 * @param {IndentationTypes} type the type of indendations to use. SPACES by default.
 * @returns {string}
 */
export function withIndendation(content: string = '', size: number, type: IndentationTypes = IndentationTypes.SPACES): string {
  if (size < 1) {
    return content;
  }

  // if the content includes new lines ensure that they have the added indentation as well.
  if (content.includes('\n')) {
    const newLineArray = content.split('\n');
    return newLineArray.reduce((accumulator, value) => {
      const newValue = value.trim() === '' ? value : `${getIndentation(size, type)}${value}`;
      return accumulator === "" ? newValue : `${accumulator}\n${newValue}`;
    }, "");
  }
  return `${getIndentation(size, type)}${content}`;
}

/**
 * Get the indendation string based on how many and which type of indentation are requested.
 * @private
 * @param {number} size the number of indendations to use
 * @param {IndentationTypes} type the type of indendations to use. SPACES by default.
 * @returns {string}
 */
function getIndentation(size: number = 0, type: IndentationTypes = IndentationTypes.SPACES): string {
  const whitespaceChar = type === IndentationTypes.SPACES ? ' ' : '\t';
  return Array(size).fill(whitespaceChar).join("");
}
