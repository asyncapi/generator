/* eslint-disable sonarjs/no-duplicate-string */
jest.mock('node-fetch');
const fs = require('fs');
const path = require('path');
const Generator = require('../lib/generator');
const log = require('loglevel');
const utils = require('../lib/utils');

const logMessage = require('./../lib/logMessages.js');

describe('Utils', () => {
  describe('#getTemplateDetails', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });
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
      jest.spyOn(utils, 'isFileSystemPath').mockReturnValue(true);
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
      jest.spyOn(utils, 'isFileSystemPath').mockReturnValue(false);
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
      jest.spyOn(utils, 'isFileSystemPath').mockReturnValue(false);
      resolvePkg.__resolvePkgValue = undefined;
      resolveFrom.__resolveFromValue = path.join(Generator.DEFAULT_TEMPLATES_DIR, templateNpmName, 'package.json');
      utils.getTemplateDetails(templateNpmName, 'package.json');
      expect(log.debug).not.toHaveBeenCalledWith(logMessage.NODE_MODULES_INSTALL);
      expect(log.debug).toHaveBeenCalledWith(logMessage.templateNotFound(templateNpmName));
    });

    it('does not work with a url', async () => {
      resolvePkg.__resolvePkgValue = undefined;
      resolveFrom.__resolveFromValue = undefined;
      const result = utils.getTemplateDetails(templateNpmName, 'package.json');
      expect(result).toStrictEqual(undefined);
    });
  });

  describe('#exists', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return true if file exists', async () => {
      jest.spyOn(fs.promises, 'stat').mockResolvedValueOnce({});

      const exists = await utils.exists('existing-file');

      expect(fs.promises.stat).toHaveBeenCalledWith(
        'existing-file',
        fs.constants.F_OK
      );
      expect(exists).toBe(true);
    });

    it('should return false if file does not exist', async () => {
      const error = new Error('File not found');

      jest.spyOn(fs.promises, 'stat').mockRejectedValueOnce(error);
      jest.spyOn(log, 'debug').mockImplementation(() => {});

      const exists = await utils.exists('non-existing-file');

      expect(fs.promises.stat).toHaveBeenCalledWith(
        'non-existing-file',
        fs.constants.F_OK
      );

      expect(log.debug).toHaveBeenCalledWith(
        `File non-existing-file couldn't be found. Error: ${error.message}`
      );

      expect(exists).toBe(false);
    });
  });

  describe('#isJsFile', () => {
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
  describe('#isFileSystemPath', () => {
    it('detects absolute path', () => {
      const result = utils.isFileSystemPath(__dirname);
      expect(result).toBe(true);
    });

    it('detects relative path', () => {
      const result = utils.isFileSystemPath(`.${path.sep}test`);
      expect(result).toBe(true);
    });

    it('detects parent relative path', () => {
      const result = utils.isFileSystemPath(`..${path.sep}test`);
      expect(result).toBe(true);
    });

    it('detects home path', () => {
      const result = utils.isFileSystemPath('~/folder');
      expect(result).toBe(true);
    });

    it('returns false for package name', () => {
      const result = utils.isFileSystemPath('express');
      expect(result).toBe(false);
    });
  });
  describe('#convertMapToObject', () => {
    it('converts map to object', () => {
      const map = new Map();
      map.set('a', 1);
      map.set('b', 2);
      const result = utils.convertMapToObject(map);

      expect(result).toEqual({ a: 1, b: 2 });
    });
  });
  describe('#isFilePath', () => {
    it('returns true for file path', () => {
      expect(utils.isFilePath('./test.yaml')).toBe(true);
    });

    it('returns false for url', () => {
      expect(utils.isFilePath('https://example.com')).toBe(false);
    });
  });
  describe('#getGeneratorVersion', () => {
    it('returns generator version', () => {
      const version = utils.getGeneratorVersion();
      expect(version).toBeDefined();
    });
  });
  describe('#isAsyncFunction', () => {
    it('detects async function', () => {
      async function test() {}

      expect(utils.isAsyncFunction(test)).toBe(true);
    });

    it('detects non async function', () => {
      function test() {}

      expect(utils.isAsyncFunction(test)).toBe(false);
    });
  });
  describe('#convertCollectionToObject', () => {
    it('converts collection to object', () => {
      const collection = [
        { id: () => 'a' },
        { id: () => 'b' }
      ];

      const result = utils.convertCollectionToObject(collection, 'id');

      expect(result.a).toBeDefined();
      expect(result.b).toBeDefined();
    });
  });
  describe('#fetchSpec', () => {
    it('fetches spec content', async () => {
      const fetch = require('node-fetch');

      fetch.mockResolvedValue({
        text: () => Promise.resolve('spec content')
      });

      const result = await utils.fetchSpec('http://test.com');

      expect(result).toEqual('spec content');
    });
  });
  describe('#fetchSpec error', () => {
    it('rejects when fetch fails', async () => {
      const fetch = require('node-fetch');

      fetch.mockRejectedValue(new Error('network error'));

      await expect(utils.fetchSpec('http://test.com'))
        .rejects.toThrow('network error');
    });
  });
  describe('#registerTypeScript', () => {
    it('skips when file is not ts', () => {
      expect(() => utils.registerTypeScript('file.js')).not.toThrow();
    });

    it('skips when ts-node already registered', () => {
      const previousTsNodeDev = process.env.TS_NODE_DEV;

      process.env.TS_NODE_DEV = 'true';

      try {
        expect(() => utils.registerTypeScript('file.ts')).not.toThrow();
      } finally {
        if (previousTsNodeDev === undefined) {
          delete process.env.TS_NODE_DEV;
        } else {
          process.env.TS_NODE_DEV = previousTsNodeDev;
        }
      }
    });
  });
  describe('#convertCollectionToObject edge', () => {
    it('handles empty collection', () => {
      const result = utils.convertCollectionToObject([], 'id');

      expect(result).toEqual({});
    });
  });
});