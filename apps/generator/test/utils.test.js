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

 describe('#isFileSystemPath', () => {
      it('returns true for absolute paths', () => {
        expect(utils.isFileSystemPath('/absolute/path')).toBe(true);
      });
  
      it('returns true for relative paths', () => {
        expect(utils.isFileSystemPath('./relative/path')).toBe(true);
        expect(utils.isFileSystemPath('../relative/path')).toBe(true);
      });
  
      it('returns true for home directory paths', () => {
        expect(utils.isFileSystemPath('~/home/path')).toBe(true);
      });
  
      it('returns false for URLs', () => {
        expect(utils.isFileSystemPath('https://example.com')).toBe(false);
      });
    });
  
    describe('#convertMapToObject', () => {
      it('converts a Map to an object', () => {
        const map = new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
        ]);
        const result = utils.convertMapToObject(map);
        expect(result).toEqual({ key1: 'value1', key2: 'value2' });
      });
    });
  
    describe('#isLocalTemplate', () => {
      it('returns true for symbolic links', async () => {
        jest.spyOn(fs, 'lstat').mockResolvedValue({ isSymbolicLink: () => true });
        const result = await utils.isLocalTemplate('/path/to/template');
        expect(result).toBe(true);
      });
  
      it('returns false for non-symbolic links', async () => {
        jest.spyOn(fs, 'lstat').mockResolvedValue({ isSymbolicLink: () => false });
        const result = await utils.isLocalTemplate('/path/to/template');
        expect(result).toBe(false);
      });
    });
  
    describe('#isReactTemplate', () => {
      it('returns true for React templates', () => {
        const templateConfig = { renderer: 'react' };
        expect(utils.isReactTemplate(templateConfig)).toBe(true);
      });
  
      it('returns false for non-React templates', () => {
        const templateConfig = { renderer: 'html' };
        expect(utils.isReactTemplate(templateConfig)).toBe(false);
      });
    });
  
    describe('#fetchSpec', () => {
      it('fetches content from a URL', async () => {
        const mockResponse = 'AsyncAPI content';
        jest.spyOn(global, 'fetch').mockResolvedValue({ text: () => mockResponse });
        const result = await utils.fetchSpec('https://example.com/asyncapi.yaml');
        expect(result).toBe(mockResponse);
      });
    });
  
    describe('#isFilePath', () => {
      it('returns true for file paths', () => {
        expect(utils.isFilePath('./path/to/file')).toBe(true);
      });
  
      it('returns false for URLs', () => {
        expect(utils.isFilePath('https://example.com')).toBe(false);
      });
    });
  
    describe('#isJsFile', () => {
      it('returns true for JavaScript files', () => {
        expect(utils.isJsFile('file.js')).toBe(true);
        expect(utils.isJsFile('file.jsx')).toBe(true);
        expect(utils.isJsFile('file.cjs')).toBe(true);
      });
  
      it('returns false for non-JavaScript files', () => {
        expect(utils.isJsFile('file.txt')).toBe(false);
      });
    });
  
    describe('#getGeneratorVersion', () => {
      it('returns the generator version', () => {
        const version = utils.getGeneratorVersion();
        expect(version).toBeDefined();
        expect(typeof version).toBe('string');
      });
    });
  
    describe('#isAsyncFunction', () => {
      it('returns true for async functions', () => {
        const asyncFn = async () => {};
        expect(utils.isAsyncFunction(asyncFn)).toBe(true);
      });
  
      it('returns false for non-async functions', () => {
        const syncFn = () => {};
        expect(utils.isAsyncFunction(syncFn)).toBe(false);
      });
    });
  
    describe('#registerTypeScript', () => {
      it('registers TypeScript for .ts files', () => {
        const tsNode = require('ts-node');
        jest.spyOn(tsNode, 'register');
        utils.registerTypeScript('file.ts');
        expect(tsNode.register).toHaveBeenCalled();
      });
  
      it('does not register TypeScript for non-.ts files', () => {
        const tsNode = require('ts-node');
        jest.spyOn(tsNode, 'register');
        utils.registerTypeScript('file.js');
        expect(tsNode.register).not.toHaveBeenCalled();
      });
    });
  
    describe('#convertCollectionToObject', () => {
      it('converts an array to an object', () => {
        const array = [
          { id: () => 'key1', value: 'value1' },
          { id: () => 'key2', value: 'value2' },
        ];
        const result = utils.convertCollectionToObject(array, (item) => item.id());
        expect(result).toEqual({
          key1: { id: () => 'key1', value: 'value1' },
          key2: { id: () => 'key2', value: 'value2' },
        });
      });
    });
  });
