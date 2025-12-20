/* eslint-disable sonarjs/no-duplicate-string */
const path = require('path');
const Generator = require('../lib/generator');
const log = require('loglevel');
const utils = jest.requireActual('../lib/utils');

const logMessage = require('./../lib/logMessages.js');

describe('Utils', () => {
  describe('#getTemplateDetails', () => {
    let resolvePkg, resolveFrom;
    const templateNpmName = 'nameOfTestTemplate';

    beforeEach(() => {
      resolvePkg = require('resolve-pkg');
      resolveFrom = require('resolve-from');
      jest.mock(path.resolve('./testTemplate', 'package.json'), () => ({ name: 'nameOfTestTemplate' }), { virtual: true });
      jest.mock(path.resolve(Generator.DEFAULT_TEMPLATES_DIR, templateNpmName, 'package.json'), () => ({ name: 'nameOfTestTemplate' }), { virtual: true });
    });

    it('works with a file system path', () => {
      log.debug = jest.fn();
      utils.isFileSystemPath = jest.fn(() => true);
      const templatePath = './testTemplate';
      const result = utils.getTemplateDetails(templatePath, 'package.json');
      expect(log.debug).toHaveBeenCalledWith(logMessage.NODE_MODULES_INSTALL);
      expect(result).toStrictEqual({
        name: templateNpmName,
        pkgPath: path.resolve('./testTemplate')
      });
    });

    it('works with an npm package', () => {
      log.debug = jest.fn();
      utils.isFileSystemPath = jest.fn(() => false);
      const packagePath = path.join(Generator.DEFAULT_TEMPLATES_DIR, templateNpmName);
      resolvePkg.__resolvePkgValue = packagePath;
      const result = utils.getTemplateDetails(templateNpmName, 'package.json');
      expect(log.debug).not.toHaveBeenCalledWith(logMessage.NODE_MODULES_INSTALL);
      expect(log.debug).not.toHaveBeenCalledWith(logMessage.templateNotFound(templateNpmName));
      expect(result).toStrictEqual({
        name: templateNpmName,
        pkgPath: packagePath
      });
    });

    it('works with global npm package', () => {
      log.debug = jest.fn();
      utils.isFileSystemPath = jest.fn(() => false);
      resolvePkg.__resolvePkgValue = undefined;
      resolveFrom.__resolveFromValue = path.join(Generator.DEFAULT_TEMPLATES_DIR, templateNpmName, 'package.json');
      utils.getTemplateDetails(templateNpmName, 'package.json');
      expect(log.debug).not.toHaveBeenCalledWith(logMessage.NODE_MODULES_INSTALL);
      expect(log.debug).toHaveBeenCalledWith(logMessage.templateNotFound(templateNpmName));
    });

    it('doesnt work with a url', async () => {
      resolvePkg.__resolvePkgValue = undefined;
      resolveFrom.__resolveFromValue = undefined;
      const result = utils.getTemplateDetails(templateNpmName, 'package.json');
      expect(result).toStrictEqual(undefined);
    });
  });

  describe('#exists', () => {
    it('should return true if file exist', async () => {
      const exists = await utils.exists(`${process.cwd()}/package.json`);
      expect(exists).toBeTruthy();
    });

    it('should return false if file does not exist', async () => {
      const exists = await utils.exists('./invalid-file');
      expect(exists).toBeFalsy();
    });
  });

  describe('#isJsFile',() => {
    it('should return true if file extension is .js', () => {
      const isJsFile = utils.isJsFile('./valid-file.js');
      expect(isJsFile).toBeTruthy();
    });
    it('should return true if file extension is .jsx', () => {
      const isJsFile = utils.isJsFile('./valid-file.jsx');
      expect(isJsFile).toBeTruthy();
    });
    it('should return true if file extension is .cjs', () => {
      const isJsFile = utils.isJsFile('./valid-file.cjs');
      expect(isJsFile).toBeTruthy();
    });
    it('should return false if it is not a JS file', () => {
      const isJsFile = utils.isJsFile('./invalid-file.txt');
      expect(isJsFile).toBeFalsy();
    });
    it('should return false if it is not a JS file', () => {
      const isJsFile = utils.isJsFile('./invalid-file');
      expect(isJsFile).toBeFalsy();
    });
  });

  describe('#isFilePath', () => {
    it('should return true for relative file path', () => {
      const result = utils.isFilePath('./test/file.yml');
      expect(result).toBe(true);
    });

    it('should return true for absolute file path', () => {
      const result = utils.isFilePath('/absolute/path/to/file.yml');
      expect(result).toBe(true);
    });

    it('should return false for URL with hostname', () => {
      const result = utils.isFilePath('https://example.com/api.yml');
      expect(result).toBe(false);
    });

    it('should return false for URL with http protocol', () => {
      const result = utils.isFilePath('http://example.com/api.yml');
      expect(result).toBe(false);
    });

    it('should return true for file path without protocol', () => {
      const result = utils.isFilePath('file.yml');
      expect(result).toBe(true);
    });
  });

  describe('#convertMapToObject', () => {
    it('should convert Map to object', () => {
      const map = new Map();
      map.set('key1', 'value1');
      map.set('key2', 'value2');

      const result = utils.convertMapToObject(map);

      expect(result).toEqual({
        key1: 'value1',
        key2: 'value2'
      });
    });

    it('should return empty object for empty Map', () => {
      const map = new Map();
      const result = utils.convertMapToObject(map);

      expect(result).toEqual({});
    });

    it('should handle Map with nested values', () => {
      const map = new Map();
      map.set('nested', { inner: 'value' });
      map.set('array', [1, 2, 3]);

      const result = utils.convertMapToObject(map);

      expect(result).toEqual({
        nested: { inner: 'value' },
        array: [1, 2, 3]
      });
    });
  });

  describe('#isAsyncFunction', () => {
    it('should return true for async function', () => {
      const asyncFn = async () => {};
      const result = utils.isAsyncFunction(asyncFn);

      expect(result).toBe(true);
    });

    it('should return false for regular function', () => {
      const regularFn = () => {};
      const result = utils.isAsyncFunction(regularFn);

      expect(result).toBe(false);
    });

    it('should return false for null', () => {
      const result = utils.isAsyncFunction(null);

      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = utils.isAsyncFunction(undefined);

      expect(result).toBe(false);
    });

    it('should return false for non-function values', () => {
      expect(utils.isAsyncFunction('string')).toBe(false);
      expect(utils.isAsyncFunction(123)).toBe(false);
      expect(utils.isAsyncFunction({})).toBe(false);
      expect(utils.isAsyncFunction([])).toBe(false);
    });
  });

  describe('#registerTypeScript', () => {
    const originalEnv = process.env.TS_NODE_DEV;

    beforeEach(() => {
      jest.resetModules();
      if (originalEnv) {
        delete process.env.TS_NODE_DEV;
      }
    });

    afterEach(() => {
      if (originalEnv) {
        process.env.TS_NODE_DEV = originalEnv;
      }
    });

    it('should not register for non-TypeScript file', () => {
      // Just verify it doesn't throw and returns early
      expect(() => utils.registerTypeScript('test.js')).not.toThrow();
    });

    it('should handle TypeScript file registration', () => {
      // This test verifies the function can be called without errors
      // Actual registration behavior depends on ts-node state
      expect(() => utils.registerTypeScript('test.ts')).not.toThrow();
    });

    it('should not register if TS_NODE_DEV env var is set', () => {
      process.env.TS_NODE_DEV = 'true';
      // Should return early without registering
      expect(() => utils.registerTypeScript('test.ts')).not.toThrow();
    });
  });

  describe('#convertCollectionToObject', () => {
    it('should convert array to object using idFunction', () => {
      const array = [
        { id: () => 'id1', name: 'Item 1' },
        { id: () => 'id2', name: 'Item 2' },
        { id: () => 'id3', name: 'Item 3' }
      ];

      const result = utils.convertCollectionToObject(array, 'id');

      expect(result).toEqual({
        id1: { id: expect.any(Function), name: 'Item 1' },
        id2: { id: expect.any(Function), name: 'Item 2' },
        id3: { id: expect.any(Function), name: 'Item 3' }
      });
    });

    it('should return empty object for empty array', () => {
      const result = utils.convertCollectionToObject([], 'id');

      expect(result).toEqual({});
    });

    it('should handle array with duplicate ids (last one wins)', () => {
      const array = [
        { id: () => 'same', name: 'First' },
        { id: () => 'same', name: 'Second' }
      ];

      const result = utils.convertCollectionToObject(array, 'id');

      expect(result).toEqual({
        same: { id: expect.any(Function), name: 'Second' }
      });
    });
  });

  describe('#getGeneratorVersion', () => {
    it('should return generator version from package.json', () => {
      const version = utils.getGeneratorVersion();

      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\d+\.\d+\.\d+$/); // Semantic version format
    });
  });

  describe('#isFileSystemPath', () => {
    // Note: isFileSystemPath is mocked in other tests, so we test the actual implementation
    // by temporarily restoring it
    let originalIsFileSystemPath;

    beforeEach(() => {
      // Save the actual implementation if it exists
      if (utils.isFileSystemPath && !jest.isMockFunction(utils.isFileSystemPath)) {
        originalIsFileSystemPath = utils.isFileSystemPath;
      } else {
        // Get the actual implementation from the module
        jest.resetModules();
        const actualUtils = jest.requireActual('../lib/utils');
        originalIsFileSystemPath = actualUtils.isFileSystemPath;
        utils.isFileSystemPath = originalIsFileSystemPath;
      }
    });

    it('should return true for absolute path', () => {
      // Use path.isAbsolute to create a proper absolute path for current OS
      const absolutePath = path.isAbsolute('/') ? '/absolute/path' : path.resolve('absolute', 'path');
      const result = utils.isFileSystemPath(absolutePath);
      expect(result).toBe(true);
    });

    it('should return true for relative path starting with ./', () => {
      const relativePath = `.${path.sep}relative${path.sep}path`;
      const result = utils.isFileSystemPath(relativePath);
      expect(result).toBe(true);
    });

    it('should return true for relative path starting with ../', () => {
      const relativePath = `..${path.sep}parent${path.sep}path`;
      const result = utils.isFileSystemPath(relativePath);
      expect(result).toBe(true);
    });

    it('should return true for path starting with ~', () => {
      const result = utils.isFileSystemPath('~/home/path');
      expect(result).toBe(true);
    });

    it('should return false for npm package name', () => {
      const result = utils.isFileSystemPath('@asyncapi/generator');
      expect(result).toBe(false);
    });

    it('should return false for URL', () => {
      const result = utils.isFileSystemPath('https://example.com');
      expect(result).toBe(false);
    });
  });
});
