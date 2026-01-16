import { resolveLanguageConfig } from '../../src/utils/resolveLanguageConfig';
import { GeneratorError } from '../../src/utils/resolveLanguageConfig';

describe('resolveLanguageConfig', () => {
  const context = 'test method';

  describe('unsupported language', () => {
    it('throws error when language is not supported', () => {
      const config = {
        javascript: { methodLogic: 'js logic' }
      };

      expect(() =>
        resolveLanguageConfig({
          config,
          language: 'python',
          context
        })
      ).toThrow(GeneratorError);

      expect(() =>
        resolveLanguageConfig({
          config,
          language: 'python',
          context
        })
      ).toThrow('Language "python" is not supported');
    });
  });

  describe('function-based language config', () => {
    it('returns function directly when language config is a function', () => {
      const fn = jest.fn();
      const config = {
        javascript: fn
      };

      const result = resolveLanguageConfig({
        config,
        language: 'javascript',
        context
      });

      expect(result).toBe(fn);
    });
  });

  describe('direct method config (no framework)', () => {
    it('returns method config without requiring framework', () => {
      const config = {
        python: {
          methodLogic: 'python logic',
          methodDocs: 'docs'
        }
      };

      const result = resolveLanguageConfig({
        config,
        language: 'python',
        context
      });

      expect(result).toEqual(config.python);
    });
  });

  describe('framework-based language config', () => {
    const config = {
      java: {
        quarkus: {
          methodLogic: 'java quarkus logic'
        }
      }
    };

    it('returns framework config when framework is provided', () => {
      const result = resolveLanguageConfig({
        config,
        language: 'java',
        framework: 'quarkus',
        context
      });

      expect(result).toEqual(config.java.quarkus);
    });

    it('throws error when framework is missing', () => {
      expect(() =>
        resolveLanguageConfig({
          config,
          language: 'java',
          context
        })
      ).toThrow(GeneratorError);

      expect(() =>
        resolveLanguageConfig({
          config,
          language: 'java',
          context
        })
      ).toThrow('Framework must be specified');
    });

    it('throws error when framework is unsupported', () => {
      expect(() =>
        resolveLanguageConfig({
          config,
          language: 'java',
          framework: 'spring',
          context
        })
      ).toThrow(GeneratorError);

      expect(() =>
        resolveLanguageConfig({
          config,
          language: 'java',
          framework: 'spring',
          context
        })
      ).toThrow('Framework "spring" is not supported');
    });
  });

  describe('invalid language config shape', () => {
    it('throws invalid config error for unexpected config structure', () => {
      const config = {
        javascript: 'invalid'
      };

      expect(() =>
        resolveLanguageConfig({
          config,
          language: 'javascript',
          context
        })
      ).toThrow(GeneratorError);

      expect(() =>
        resolveLanguageConfig({
          config,
          language: 'javascript',
          context
        })
      ).toThrow('Invalid configuration');
    });
  });
});
