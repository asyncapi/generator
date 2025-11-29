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

  describe('#writeFileWithFiltering', () => {
    const targetDir = '/tmp/test-target';
    const testFilePath = path.join(targetDir, 'test.txt');
    const testContent = 'test content';

    beforeEach(() => {
      utils.writeFile = jest.fn().mockResolvedValue(undefined);
      utils.exists = jest.fn().mockResolvedValue(false);
      log.debug = jest.fn();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('generateOnly filtering (whitelist)', () => {
      it('writes file when generateOnly is not set', async () => {
        const result = await utils.writeFileWithFiltering(testFilePath, testContent, {}, targetDir, [], []);
        expect(result).toBe(true);
        expect(utils.writeFile).toHaveBeenCalledWith(testFilePath, testContent, {});
      });

      it('writes file when generateOnly is empty array', async () => {
        const result = await utils.writeFileWithFiltering(testFilePath, testContent, {}, targetDir, [], []);
        expect(result).toBe(true);
        expect(utils.writeFile).toHaveBeenCalledWith(testFilePath, testContent, {});
      });

      it('writes file when it matches single pattern', async () => {
        const jsonFilePath = path.join(targetDir, 'package.json');
        const result = await utils.writeFileWithFiltering(jsonFilePath, testContent, {}, targetDir, [], ['*.json']);
        expect(result).toBe(true);
        expect(utils.writeFile).toHaveBeenCalledWith(jsonFilePath, testContent, {});
      });

      it('skips file when it does not match pattern', async () => {
        const jsFilePath = path.join(targetDir, 'index.js');
        const result = await utils.writeFileWithFiltering(jsFilePath, testContent, {}, targetDir, [], ['*.json']);
        expect(result).toBe(false);
        expect(utils.writeFile).not.toHaveBeenCalled();
        expect(log.debug).toHaveBeenCalledWith(logMessage.skipGenerateOnly(jsFilePath));
      });

      it('writes file when it matches any pattern from multiple patterns', async () => {
        const jsonFilePath = path.join(targetDir, 'package.json');
        const jsFilePath = path.join(targetDir, 'src/models/User.js');

        const result1 = await utils.writeFileWithFiltering(jsonFilePath, testContent, {}, targetDir, [], ['*.json', 'src/**/*.js']);
        const result2 = await utils.writeFileWithFiltering(jsFilePath, testContent, {}, targetDir, [], ['*.json', 'src/**/*.js']);

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(utils.writeFile).toHaveBeenCalledTimes(2);
      });

      it('skips file when it does not match any pattern from multiple patterns', async () => {
        const mdFilePath = path.join(targetDir, 'README.md');
        const result = await utils.writeFileWithFiltering(mdFilePath, testContent, {}, targetDir, [], ['*.json', 'src/**/*.js']);
        expect(result).toBe(false);
        expect(utils.writeFile).not.toHaveBeenCalled();
      });

      it('works with complex glob patterns', async () => {
        const userFilePath = path.join(targetDir, 'src/models/User.java');
        const daoFilePath = path.join(targetDir, 'src/models/dao/UserDao.java');

        const result1 = await utils.writeFileWithFiltering(userFilePath, testContent, {}, targetDir, [], ['src/models/**/*.java', '!src/models/**/Test*.java']);
        const result2 = await utils.writeFileWithFiltering(daoFilePath, testContent, {}, targetDir, [], ['src/models/**/*.java', '!src/models/**/Test*.java']);

        expect(result1).toBe(true);
        expect(result2).toBe(true);
      });

      it('excludes files when negated patterns match', async () => {
        const chatFilePath = path.join(targetDir, 'src/api/routes/chat.js');
        const testRouteFilePath = path.join(targetDir, 'src/api/routes/testRoute.js');

        const result1 = await utils.writeFileWithFiltering(chatFilePath, testContent, {}, targetDir, [], ['src/**/*.js', '!src/**/test*.js']);
        const result2 = await utils.writeFileWithFiltering(testRouteFilePath, testContent, {}, targetDir, [], ['src/**/*.js', '!src/**/test*.js']);

        expect(result1).toBe(true);
        expect(result2).toBe(false);
        expect(log.debug).toHaveBeenCalledWith(logMessage.skipGenerateOnly(testRouteFilePath));
      });
    });

    describe('noOverwriteGlobs filtering (blacklist)', () => {
      it('skips overwriting existing file that matches noOverwriteGlobs', async () => {
        const existingFilePath = path.join(targetDir, 'package.json');
        utils.exists = jest.fn().mockResolvedValue(true);

        const result = await utils.writeFileWithFiltering(existingFilePath, testContent, {}, targetDir, ['*.json'], []);

        expect(result).toBe(false);
        expect(utils.writeFile).not.toHaveBeenCalled();
        expect(log.debug).toHaveBeenCalledWith(logMessage.skipOverwrite(existingFilePath));
      });

      it('writes new file even if it matches noOverwriteGlobs', async () => {
        const newFilePath = path.join(targetDir, 'package.json');
        utils.exists = jest.fn().mockResolvedValue(false);

        const result = await utils.writeFileWithFiltering(newFilePath, testContent, {}, targetDir, ['*.json'], []);

        expect(result).toBe(true);
        expect(utils.writeFile).toHaveBeenCalledWith(newFilePath, testContent, {});
      });

      it('overwrites existing file that does not match noOverwriteGlobs', async () => {
        const existingFilePath = path.join(targetDir, 'index.js');
        utils.exists = jest.fn().mockResolvedValue(true);

        const result = await utils.writeFileWithFiltering(existingFilePath, testContent, {}, targetDir, ['*.json'], []);

        expect(result).toBe(true);
        expect(utils.writeFile).toHaveBeenCalledWith(existingFilePath, testContent, {});
      });
    });

    describe('combined filtering (generateOnly + noOverwriteGlobs)', () => {
      it('applies generateOnly filter first, then noOverwriteGlobs', async () => {
        const jsonFilePath = path.join(targetDir, 'package.json');
        utils.exists = jest.fn().mockResolvedValue(true);

        const result = await utils.writeFileWithFiltering(jsonFilePath, testContent, {}, targetDir, ['*.json'], ['*.json']);

        expect(result).toBe(false);
        expect(utils.writeFile).not.toHaveBeenCalled();
        expect(log.debug).toHaveBeenCalledWith(logMessage.skipOverwrite(jsonFilePath));
      });

      it('skips file that does not match generateOnly, ignoring noOverwriteGlobs', async () => {
        const jsFilePath = path.join(targetDir, 'index.js');

        const result = await utils.writeFileWithFiltering(jsFilePath, testContent, {}, targetDir, ['package.json'], ['*.json']);

        expect(result).toBe(false);
        expect(utils.writeFile).not.toHaveBeenCalled();
        expect(log.debug).toHaveBeenCalledWith(logMessage.skipGenerateOnly(jsFilePath));
      });

      it('writes file that matches generateOnly and does not match noOverwriteGlobs', async () => {
        const jsonFilePath = path.join(targetDir, 'tsconfig.json');
        utils.exists = jest.fn().mockResolvedValue(true);

        const result = await utils.writeFileWithFiltering(jsonFilePath, testContent, {}, targetDir, ['package.json'], ['*.json']);

        expect(result).toBe(true);
        expect(utils.writeFile).toHaveBeenCalledWith(jsonFilePath, testContent, {});
      });
    });

    describe('file options', () => {
      it('passes file options to writeFile', async () => {
        const options = { mode: 0o755 };
        const result = await utils.writeFileWithFiltering(testFilePath, testContent, options, targetDir, [], []);

        expect(result).toBe(true);
        expect(utils.writeFile).toHaveBeenCalledWith(testFilePath, testContent, options);
      });
    });
  });
});
