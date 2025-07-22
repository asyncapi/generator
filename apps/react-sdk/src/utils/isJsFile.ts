const ALLOWED_EXTS = ['js', 'jsx', 'cjs'];

/**
 * Function which checks if file is JS file
 * @private
 * @param {string} filename
 * @returns {boolean}
 */
export function isJsFile(filename: string = '') {
  const ext = filename.split('.').pop() || '';
  return ALLOWED_EXTS.includes(ext);
}
