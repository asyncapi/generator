module.exports = {
  /**
   * Minimal mock for requireg.resolve used in tests.
   * It just needs to return a string containing 'index.js'
   * so that generator.js can safely call .replace('index.js','').
   */
  resolve() {
    return 'npm/index.js';
  }
};

