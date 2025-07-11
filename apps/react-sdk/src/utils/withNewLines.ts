/**
 * Prepend given number of the new lines to content.
 * @private
 * @param {string} content 
 * @param {number} number
 * @returns {string}
 */
export function withNewLines(content: string = '', number: number = 0): string {
  const newLines = Array(number).fill('\n').join('');
  return content + newLines;
}
