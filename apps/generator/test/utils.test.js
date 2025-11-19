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

  describe('#isGitSpecifier', () => {
    it('returns true for git+https url', () => {
      expect(utils.isGitSpecifier('git+https://github.com/org/repo.git')).toBeTruthy();
    });

    it('returns true for git+ssh url', () => {
      expect(utils.isGitSpecifier('git+ssh://git@github.com/org/repo.git')).toBeTruthy();
    });

    it('returns true for ssh url', () => {
      expect(utils.isGitSpecifier('ssh://git@gitlab.com/org/repo.git')).toBeTruthy();
    });

    it('returns true for ssh-style git@host:path', () => {
      expect(utils.isGitSpecifier('git@github.com:org/repo.git')).toBeTruthy();
    });

    it('returns true for github shorthand', () => {
      expect(utils.isGitSpecifier('github:org/repo')).toBeTruthy();
    });

    it('returns true for gitlab shorthand', () => {
      expect(utils.isGitSpecifier('gitlab:org/repo')).toBeTruthy();
    });

    it('returns true for git:// protocol', () => {
      expect(utils.isGitSpecifier('git://github.com/org/repo.git')).toBeTruthy();
    });

    it('returns true for bitbucket shorthand', () => {
      expect(utils.isGitSpecifier('bitbucket:org/repo')).toBeTruthy();
    });

    it('returns false for plain https url', () => {
      expect(utils.isGitSpecifier('https://example.com/template.tgz')).toBeFalsy();
    });

    it('returns false for npm package name', () => {
      expect(utils.isGitSpecifier('@asyncapi/html-template')).toBeFalsy();
    });

    it('returns false for file system path', () => {
      expect(utils.isGitSpecifier('./my-template')).toBeFalsy();
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

  describe('#isReactTemplate', () => {
    it('should return true if it is a react template', () => {
      const templateConfig  = {
        renderer: 'react'
      };
      const isReactTemplate = utils.isReactTemplate(templateConfig);
      expect(isReactTemplate).toBeTruthy();
    });

    it('should return false if it is not a react template', () => {
      const templateConfig  = {
        renderer: 'nunjucks'
      };
      const isReactTemplate = utils.isReactTemplate(templateConfig);
      expect(isReactTemplate).toBeFalsy();
    });
    
    it('should return false if template config is not specified', () => {
      const templateConfig  = {};
      const isReactTemplate = utils.isReactTemplate(templateConfig);
      expect(isReactTemplate).toBeFalsy();
    });

    it('should return false if template config is undefined', () => {
      const templateConfig  = undefined;
      const isReactTemplate = utils.isReactTemplate(templateConfig);
      expect(isReactTemplate).toBeFalsy();
    });
  });
});
