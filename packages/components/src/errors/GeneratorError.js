export class GeneratorError extends Error {
  constructor(code, message, meta = {}) {
    super(message);
    this.name = 'GeneratorComponentError';
    this.code = code;
    this.meta = meta;
  }
}
