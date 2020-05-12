/* eslint-disable sonarjs/no-duplicate-string */
const fs = require('fs');
const path = require('path');
const Generator = require('../lib/generator');

const streetlightYAML = fs.readFileSync(path.resolve(__dirname, './docs/streetlights.yml'), 'utf8');

jest.mock('../lib/utils');
jest.mock('../lib/filtersRegistry');
jest.mock('../lib/hooksRegistry');

describe('Generator', () => {
  describe('constructor', () => {
    it('works with minimum amount of params', () => {
      const gen = new Generator('testTemplate', __dirname);
      expect(gen.templateName).toStrictEqual('testTemplate');
      expect(gen.targetDir).toStrictEqual(__dirname);
      expect(gen.entrypoint).toStrictEqual(undefined);
      expect(gen.noOverwriteGlobs).toStrictEqual([]);
      expect(gen.disabledHooks).toStrictEqual([]);
      expect(gen.output).toStrictEqual('fs');
      expect(gen.forceWrite).toStrictEqual(false);
      expect(gen.install).toStrictEqual(false);
      expect(gen.templateParams).toStrictEqual({});
    });

    it('works with all the params', () => {
      const gen = new Generator('testTemplate', __dirname, {
        entrypoint: 'test-entrypoint',
        noOverwriteGlobs: ['test-globs'],
        disabledHooks: ['test-hooks'],
        output: 'string',
        forceWrite: true,
        install: true,
        templateParams: {
          test: true,
        },
      });
      expect(gen.templateName).toStrictEqual('testTemplate');
      expect(gen.targetDir).toStrictEqual(__dirname);
      expect(gen.entrypoint).toStrictEqual('test-entrypoint');
      expect(gen.noOverwriteGlobs).toStrictEqual(['test-globs']);
      expect(gen.disabledHooks).toStrictEqual(['test-hooks']);
      expect(gen.output).toStrictEqual('string');
      expect(gen.forceWrite).toStrictEqual(true);
      expect(gen.install).toStrictEqual(true);
      expect(() => gen.templateParams.test).toThrow('Template parameter "test" has not been defined in the .tp-config.json file. Please make sure it\'s listed there before you use it in your template.');

      // Mock params on templateConfig so it doesn't fail.
      gen.templateConfig.parameters = { test: {} };

      expect(gen.templateParams.test).toStrictEqual(true);
    });

    it('fails if no templateName is given', () => {
      const t = () => new Generator();
      expect(t).toThrow('No template name has been specified.');
    });

    it('fails if no targetDir is given', () => {
      const t = () => new Generator('testTemplate');
      expect(t).toThrow('No target directory has been specified.');
    });

    it('fails if output is given and is different than "fs" and "string"', () => {
      const t = () => new Generator('testTemplate', __dirname, { output: 'fail' });
      expect(t).toThrow('Invalid output type fail. Valid values are \'fs\' and \'string\'.');
    });
  });

  describe('#generate', () => {
    let asyncApiDocumentMock;
    let xfsMock;
    let util;
    let filtersRegistry;
    let hooksRegistry;

    const mockMethods = (gen) => {
      gen.verifyTargetDir = jest.fn();
      gen.installTemplate = jest.fn().mockResolvedValue({ name: 'nameOfTestTemplate', path: '/path/to/template/nameOfTestTemplate' });
      gen.configNunjucks = jest.fn();
      gen.loadTemplateConfig = jest.fn();
      gen.registerHooks = jest.fn();
      gen.registerFilters = jest.fn();
      gen.validateTemplateConfig = jest.fn();
      gen.generateDirectoryStructure = jest.fn();
      gen.launchHook = jest.fn();
      gen.generateFile = jest.fn();
      gen.renderString = jest.fn();
    };

    beforeAll(() => {
      util = require('../lib/utils');
      filtersRegistry = require('../lib/filtersRegistry');
      hooksRegistry = require('../lib/hooksRegistry');
      xfsMock = require('fs.extra');
      const parserMock = require('@asyncapi/parser');
      asyncApiDocumentMock = new parserMock.AsyncAPIDocument();
    });

    it('works with output=fs, forceWrite=false, install=false', async () => {
      const gen = new Generator('testTemplate', __dirname);
      mockMethods(gen);
      await gen.generate(asyncApiDocumentMock);

      expect(xfsMock.mkdirpSync).toHaveBeenCalledWith(__dirname);
      expect(gen.verifyTargetDir).toHaveBeenCalledWith(__dirname);
      expect(gen.installTemplate).toHaveBeenCalledWith(false);
      expect(gen.configNunjucks).toHaveBeenCalled();
      expect(gen.loadTemplateConfig).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(filtersRegistry.registerFilters).toHaveBeenCalled();
      expect(gen.validateTemplateConfig).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.generateDirectoryStructure).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.launchHook).toHaveBeenCalledWith('generate:after');

      expect(util.exists).toHaveBeenCalledTimes(0);
      expect(util.readFile).toHaveBeenCalledTimes(0);
      expect(gen.generateFile).toHaveBeenCalledTimes(0);
      expect(gen.renderString).toHaveBeenCalledTimes(0);
    });

    it('works with output=fs, forceWrite=false, install=true', async () => {
      const gen = new Generator('testTemplate', __dirname, { install: true });
      mockMethods(gen);
      await gen.generate(asyncApiDocumentMock);

      expect(xfsMock.mkdirpSync).toHaveBeenCalledWith(__dirname);
      expect(gen.verifyTargetDir).toHaveBeenCalledWith(__dirname);
      expect(gen.installTemplate).toHaveBeenCalledWith(true);
      expect(gen.configNunjucks).toHaveBeenCalled();
      expect(gen.loadTemplateConfig).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(filtersRegistry.registerFilters).toHaveBeenCalled();
      expect(gen.validateTemplateConfig).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.generateDirectoryStructure).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.launchHook).toHaveBeenCalledWith('generate:after');

      expect(util.exists).toHaveBeenCalledTimes(0);
      expect(util.readFile).toHaveBeenCalledTimes(0);
      expect(gen.generateFile).toHaveBeenCalledTimes(0);
      expect(gen.renderString).toHaveBeenCalledTimes(0);
    });

    it('works with output=fs, forceWrite=true, install=false', async () => {
      const gen = new Generator('testTemplate', __dirname, { forceWrite: true });
      mockMethods(gen);
      await gen.generate(asyncApiDocumentMock);

      expect(xfsMock.mkdirpSync).toHaveBeenCalledWith(__dirname);
      expect(gen.installTemplate).toHaveBeenCalledWith(false);
      expect(gen.configNunjucks).toHaveBeenCalled();
      expect(gen.loadTemplateConfig).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(filtersRegistry.registerFilters).toHaveBeenCalled();
      expect(gen.validateTemplateConfig).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.generateDirectoryStructure).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.launchHook).toHaveBeenCalledWith('generate:after');

      expect(util.exists).toHaveBeenCalledTimes(0);
      expect(util.readFile).toHaveBeenCalledTimes(0);
      expect(gen.verifyTargetDir).toHaveBeenCalledTimes(0);
      expect(gen.generateFile).toHaveBeenCalledTimes(0);
      expect(gen.renderString).toHaveBeenCalledTimes(0);
    });

    it('works with output=fs, forceWrite=true, install=true', async () => {
      const gen = new Generator('testTemplate', __dirname, { forceWrite: true, install: true });
      mockMethods(gen);
      await gen.generate(asyncApiDocumentMock);

      expect(xfsMock.mkdirpSync).toHaveBeenCalledWith(__dirname);
      expect(gen.installTemplate).toHaveBeenCalledWith(true);
      expect(gen.configNunjucks).toHaveBeenCalled();
      expect(gen.loadTemplateConfig).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(filtersRegistry.registerFilters).toHaveBeenCalled();
      expect(gen.validateTemplateConfig).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.generateDirectoryStructure).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.launchHook).toHaveBeenCalledWith('generate:after');

      expect(util.exists).toHaveBeenCalledTimes(0);
      expect(util.readFile).toHaveBeenCalledTimes(0);
      expect(gen.verifyTargetDir).toHaveBeenCalledTimes(0);
      expect(gen.generateFile).toHaveBeenCalledTimes(0);
      expect(gen.renderString).toHaveBeenCalledTimes(0);
    });

    it('works with output=fs, forceWrite=false, install=false, entrypoint=set', async () => {
      const gen = new Generator('testTemplate', __dirname, { entrypoint: 'file.js' });
      mockMethods(gen);
      util.exists.mockResolvedValue(true);
      await gen.generate(asyncApiDocumentMock);

      expect(xfsMock.mkdirpSync).toHaveBeenCalledWith(__dirname);
      expect(gen.verifyTargetDir).toHaveBeenCalledWith(__dirname);
      expect(gen.installTemplate).toHaveBeenCalledWith(false);
      expect(gen.configNunjucks).toHaveBeenCalled();
      expect(gen.loadTemplateConfig).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(filtersRegistry.registerFilters).toHaveBeenCalled();
      expect(gen.validateTemplateConfig).toHaveBeenCalledWith(asyncApiDocumentMock);
      expect(gen.launchHook).toHaveBeenCalledWith('generate:after');
      expect(util.exists).toHaveBeenCalledWith('/path/to/template/nameOfTestTemplate/template/file.js');
      expect(gen.generateFile).toHaveBeenCalledWith(asyncApiDocumentMock, 'file.js', '/path/to/template/nameOfTestTemplate/template');

      expect(util.readFile).toHaveBeenCalledTimes(0);
      expect(gen.renderString).toHaveBeenCalledTimes(0);
      expect(gen.generateDirectoryStructure).toHaveBeenCalledTimes(0);
    });
  });

  describe('#generateFromString', () => {
    let generateMock;
    let parserMock;

    beforeAll(() => {
      parserMock = require('@asyncapi/parser');
      generateMock = jest.fn().mockResolvedValue();
    });

    it('calls parser.parse and this.generate', async () => {
      const gen = new Generator('testTemplate', __dirname);
      gen.generate = generateMock;
      await gen.generateFromString(streetlightYAML);

      expect(generateMock).toHaveBeenCalled();
      expect(parserMock.parse).toHaveBeenCalled();
      expect(parserMock.parse.mock.calls[0][0]).toBe(streetlightYAML);
      expect(parserMock.parse.mock.calls[0][1]).toStrictEqual({});
    });

    it('calls parser.parse with the right options', async () => {
      const gen = new Generator('testTemplate', __dirname);
      const fakeOptions = { test: true };
      gen.generate = generateMock;
      await gen.generateFromString(streetlightYAML, fakeOptions);

      expect(parserMock.parse).toHaveBeenCalled();
      expect(parserMock.parse.mock.calls[0][0]).toBe(streetlightYAML);
      expect(parserMock.parse.mock.calls[0][1]).toStrictEqual(fakeOptions);
    });

    it('fails if asyncapiString is not provided', async () => {
      const gen = new Generator('testTemplate', __dirname);
      gen.generate = generateMock;
      expect(() => gen.generateFromString()).rejects.toThrow('Parameter "asyncapiString" must be a non-empty string.');
    });

    it('fails if asyncapiString is not a string', async () => {
      const gen = new Generator('testTemplate', __dirname);
      gen.generate = generateMock;
      expect(() => gen.generateFromString(1)).rejects.toThrow('Parameter "asyncapiString" must be a non-empty string.');
    });

    it('stores the original asyncapi document', async () => {
      const gen = new Generator('testTemplate', __dirname);
      gen.generate = generateMock;
      await gen.generateFromString(streetlightYAML);
      expect(gen.originalAsyncAPI).toBe(streetlightYAML);
    });
  });

  describe('#generateFromFile', () => {
    it('calls readFile and generateFromString with the right params', async () => {
      const utils = require('../lib/utils');
      const filePath = 'fake-asyncapi.yml';
      utils.__files = {
        [filePath]: 'test content',
      };
      const generateFromStringMock = jest.fn().mockResolvedValue();
      const gen = new Generator('testTemplate', __dirname);
      gen.generateFromString = generateFromStringMock;
      await gen.generateFromFile('fake-asyncapi.yml');
      expect(utils.readFile).toHaveBeenCalled();
      expect(utils.readFile.mock.calls[0][0]).toBe(filePath);
      expect(utils.readFile.mock.calls[0][1]).toStrictEqual({ encoding: 'utf8' });
      expect(generateFromStringMock.mock.calls[0][0]).toBe('test content');
      expect(generateFromStringMock.mock.calls[0][1]).toStrictEqual({ path: filePath });
    });
  });

  describe('#installTemplate', () => {
    let npmiMock;
    let utils;

    beforeEach(() => {
      npmiMock = require('npmi');
      utils = require('../lib/utils');
      jest.mock(path.resolve('./testTemplate', 'package.json'), () => ({ name: 'nameOfTestTemplate' }), { virtual: true });
      jest.mock(path.resolve(Generator.DEFAULT_TEMPLATES_DIR, 'nameOfTestTemplate', 'package.json'), () => ({ name: 'nameOfTestTemplate' }), { virtual: true });
    });

    it('works with a file system path', async () => {
      utils.__isFileSystemPathValue = true;
      const gen = new Generator('./testTemplate', __dirname);
      await gen.installTemplate();
      expect(npmiMock).toHaveBeenCalledTimes(0);
    });

    it('works with a file system path and force = true', async () => {
      const gen = new Generator('./testTemplate', __dirname);
      gen.installTemplate(true);
      expect(npmiMock).toHaveBeenCalled();
      expect(npmiMock.mock.calls[0][0]).toStrictEqual({
        name: './testTemplate',
        install: true,
        path: path.resolve(__dirname, '..'),
        pkgName: 'dummy value so it does not force installation always',
        npmLoad: {
          loglevel: 'http',
          save: false,
          audit: false,
          progress: false,
        },
      });
    });

    it('works with an npm package', async () => {
      utils.__isFileSystemPathValue = false;
      const gen = new Generator('nameOfTestTemplate', __dirname);
      await gen.installTemplate();
      expect(npmiMock).toHaveBeenCalledTimes(0);
    });

    it('works with an npm package that has already been installed as a local template', async () => {
      console.info = jest.fn();
      utils.__isFileSystemPathValue = false;
      utils.__isLocalTemplateValue = true;
      utils.__getLocalTemplateDetailsResolvedLinkValue = '/path/to/template/nameOfTestTemplate';
      const gen = new Generator('nameOfTestTemplate', __dirname);
      await gen.installTemplate();
      expect(console.info).toHaveBeenCalledWith('This template has already been installed and it\'s pointing to your filesystem at /path/to/template/nameOfTestTemplate.');
      expect(npmiMock).toHaveBeenCalledTimes(0);
    });

    it('works with an npm package and force = true', async () => {
      const gen = new Generator('nameOfTestTemplate', __dirname);
      gen.installTemplate(true);
      expect(npmiMock).toHaveBeenCalled();
    });

    it('works with a url', async () => {
      utils.__isFileSystemPathValue = false;
      const gen = new Generator('https://my-test-template.com', __dirname);
      gen.installTemplate();
      setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
        expect(npmiMock).toHaveBeenCalledTimes(1);
      }, 0);
    });

    it('works with a url and force = true', async () => {
      const gen = new Generator('https://my-test-template.com', __dirname);
      gen.installTemplate(true);
      setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
        expect(npmiMock).toHaveBeenCalledTimes(1);
      }, 0);
    });
  });

  describe('.getTemplateFile', () => {
    it('retrieves the content of a template file', async () => {
      const utils = require('../lib/utils');
      const filePath = path.resolve(Generator.DEFAULT_TEMPLATES_DIR, 'simple', 'template/static.md');
      utils.__files = {
        [filePath]: 'test content',
      };
      const content = await Generator.getTemplateFile('simple', 'template/static.md');
      expect(utils.readFile).toHaveBeenCalled();
      expect(utils.readFile.mock.calls[0][0]).toBe(filePath);
      expect(content).toBe(utils.__files[filePath]);
    });

    it('retrieves the content of a template file overriding the default template dir', async () => {
      const utils = require('../lib/utils');
      const filePath = path.resolve('~', 'templates', 'simple', 'template/static.md');
      utils.__files = {
        [filePath]: 'test content',
      };
      const content = await Generator.getTemplateFile('simple', 'template/static.md', path.resolve('~', 'templates'));
      expect(utils.readFile).toHaveBeenCalled();
      expect(utils.readFile.mock.calls[0][0]).toBe(filePath);
      expect(content).toBe(utils.__files[filePath]);
    });
  });
});
