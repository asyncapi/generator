/* eslint-disable sonarjs/no-duplicate-string */
const fs = require('fs');
const path = require('path');
const Generator = require('../lib/generator');
const log = require('loglevel');
const utils = jest.requireActual('../lib/utils');

const logMessage = require('./../lib/logMessages.js');

jest.mock('node-fetch');
const fetch = require('node-fetch');

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

  describe('#fetchSpec', () => {
    const specUrl = 'http://example.com/asyncapi.yaml';

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('returns response body on HTTP 200', async () => {
      const body = 'asyncapi: 2.6.0\ninfo:\n  title: test\n  version: 0.0.1';
      fetch.mockResolvedValueOnce({ ok: true, text: jest.fn().mockResolvedValueOnce(body) });

      await expect(utils.fetchSpec(specUrl)).resolves.toBe(body);
    });

    it('rejects with error message including URL and status on 404', async () => {
      fetch.mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not Found' });

      await expect(utils.fetchSpec(specUrl)).rejects.toThrow(
        logMessage.fetchSpecError(specUrl, 404, ' Not Found')
      );
    });

    it('rejects with error message including URL and status on 500', async () => {
      fetch.mockResolvedValueOnce({ ok: false, status: 500, statusText: 'Internal Server Error' });

      await expect(utils.fetchSpec(specUrl)).rejects.toThrow(
        logMessage.fetchSpecError(specUrl, 500, ' Internal Server Error')
      );
    });

    it('rejects with only status code when response has no status text', async () => {
      fetch.mockResolvedValueOnce({ ok: false, status: 503, statusText: '' });

      await expect(utils.fetchSpec(specUrl)).rejects.toThrow(
        logMessage.fetchSpecError(specUrl, 503, '')
      );
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
});
