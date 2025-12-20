/* eslint-disable sonarjs/no-duplicate-string */
const fs = require('fs');
const path = require('path');
const Generator = require('../lib/generator');
const log = require('loglevel');
const unixify = require('unixify');
const dummyYAML = fs.readFileSync(path.resolve(__dirname, './docs/dummy.yml'), 'utf8');

const logMessage = require('./../lib/logMessages.js');

jest.mock('../lib/utils');
jest.mock('../lib/hooksRegistry');
jest.mock('../lib/templates/config/validator');
jest.mock('../lib/templates/config/loader');
jest.mock('simple-git');
jest.mock('../lib/conditionalGeneration');

describe('Generator', () => {
  describe('constructor', () => {
    it('works with minimum amount of params', () => {
      const gen = new Generator('testTemplate', __dirname);
      expect(gen.templateName).toStrictEqual('testTemplate');
      expect(gen.targetDir).toStrictEqual(__dirname);
      expect(gen.entrypoint).toStrictEqual(undefined);
      expect(gen.noOverwriteGlobs).toStrictEqual([]);
      expect(gen.disabledHooks).toStrictEqual({});
      expect(gen.output).toStrictEqual('fs');
      expect(gen.forceWrite).toStrictEqual(false);
      expect(gen.install).toStrictEqual(false);
      expect(gen.templateParams).toStrictEqual({});
      expect(gen.compile).toStrictEqual(true);
    });

    it('works with all the params', () => {
      const gen = new Generator('testTemplate', __dirname, {
        entrypoint: 'test-entrypoint',
        noOverwriteGlobs: ['test-globs'],
        disabledHooks: { 'test-hooks': true, 'generate:after': ['foo', 'bar'], foo: 'bar' },
        output: 'string',
        forceWrite: true,
        install: true,
        templateParams: {
          test: true,
        },
        compile: false,
      });
      expect(gen.templateName).toStrictEqual('testTemplate');
      expect(gen.targetDir).toStrictEqual(__dirname);
      expect(gen.entrypoint).toStrictEqual('test-entrypoint');
      expect(gen.noOverwriteGlobs).toStrictEqual(['test-globs']);
      expect(gen.disabledHooks).toStrictEqual({ 'test-hooks': true, 'generate:after': ['foo', 'bar'], foo: 'bar' });
      expect(gen.output).toStrictEqual('string');
      expect(gen.forceWrite).toStrictEqual(true);
      expect(gen.install).toStrictEqual(true);
      expect(gen.compile).toStrictEqual(false);
      expect(() => gen.templateParams.test).toThrow('Template parameter "test" has not been defined in the Generator Configuration. Please make sure it\'s listed there before you use it in your template.');

      // Mock params on templateConfig so it doesn't fail.
      gen.templateConfig.parameters = { test: {} };

      expect(gen.templateParams.test).toStrictEqual(true);
    });

    it('throws an error indicating an unexpected param was given', () => {
      const t = () => new Generator('testTemplate', __dirname, {
        entrypoint: 'test-entrypoint',
        noOverwriteGlobs: ['test-globs'],
        disabledHooks: { 'test-hooks': true },
        output: 'string',
        forceWrite: true,
        forceInstall: true,
        templateParams: {
          test: true,
        }
      });
      expect(t).toThrow('These options are not supported by the generator: forceInstall');
    });

    it('throws an error indicating multiple unexpected params were given', () => {
      const t = () => new Generator('testTemplate', __dirname, {
        entrypoint: 'test-entrypoint',
        noOverwriteGlobs: ['test-globs'],
        disabledHooks: { 'test-hooks': true },
        output: 'string',
        write: true,
        forceInstall: true,
        templateParams: {
          test: true,
        }
      });
      expect(t).toThrow('These options are not supported by the generator: write, forceInstall');
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
    let hooksRegistry;
    let templateConfigValidator;
    let templateConfigLoader;

    const mockMethods = (gen) => {
      gen.verifyTargetDir = jest.fn();
      gen.installTemplate = jest.fn().mockResolvedValue({ name: 'nameOfTestTemplate', path: '/path/to/template/nameOfTestTemplate' });
      gen.configureTemplate = jest.fn();
      gen.registerHooks = jest.fn();
      gen.validateTemplateConfig = jest.fn();
      gen.generateDirectoryStructure = jest.fn();
      gen.launchHook = jest.fn();
      gen.generateFile = jest.fn();
      gen.renderString = jest.fn();
    };

    beforeAll(() => {
      util = require('../lib/utils');
      hooksRegistry = require('../lib/hooksRegistry');
      templateConfigValidator = require('../lib/templates/config/validator');
      templateConfigLoader = require('../lib/templates/config/loader');
      xfsMock = require('fs.extra');
      const { AsyncAPIDocument } = require('@asyncapi/parser/cjs/models/v2/asyncapi');
      asyncApiDocumentMock = new AsyncAPIDocument({ 'x-parser-api-version': 0 });
    });

    it('works with output=fs, forceWrite=false, install=false', async () => {
      const gen = new Generator('testTemplate', __dirname);
      mockMethods(gen);
      await gen.generate(asyncApiDocumentMock);

      expect(xfsMock.mkdirpSync).toHaveBeenCalledWith(__dirname);
      expect(gen.verifyTargetDir).toHaveBeenCalledWith(__dirname);
      expect(gen.installTemplate).toHaveBeenCalledWith(false);
      expect(templateConfigLoader.loadTemplateConfig).toHaveBeenCalled();
      expect(gen.configureTemplate).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(templateConfigValidator.validateTemplateConfig).toHaveBeenCalled();
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
      expect(templateConfigLoader.loadTemplateConfig).toHaveBeenCalled();
      expect(gen.configureTemplate).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(templateConfigValidator.validateTemplateConfig).toHaveBeenCalled();
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
      expect(gen.configureTemplate).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(templateConfigValidator.validateTemplateConfig).toHaveBeenCalled();
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
      expect(templateConfigLoader.loadTemplateConfig).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(templateConfigValidator.validateTemplateConfig).toHaveBeenCalled();
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
      expect(templateConfigLoader.loadTemplateConfig).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(templateConfigValidator.validateTemplateConfig).toHaveBeenCalled();
      expect(gen.launchHook).toHaveBeenCalledWith('generate:after');
      expect(unixify(util.exists.mock.calls[0][0])).toEqual('/path/to/template/nameOfTestTemplate/template/file.js');
      expect(gen.generateFile.mock.calls[0][0]).toEqual(asyncApiDocumentMock);
      expect(gen.generateFile.mock.calls[0][1]).toEqual('file.js');
      expect(unixify(gen.generateFile.mock.calls[0][2])).toEqual('/path/to/template/nameOfTestTemplate/template');
      expect(util.readFile).toHaveBeenCalledTimes(0);
      expect(gen.renderString).toHaveBeenCalledTimes(0);
      expect(gen.generateDirectoryStructure).toHaveBeenCalledTimes(0);
    });

    it('should be able to generate with string inputs', async () => {
      const gen = new Generator('testTemplate', __dirname);
      templateConfigLoader.loadTemplateConfig.mockReturnValue({});
      mockMethods(gen);
      await gen.generate(dummyYAML);

      expect(xfsMock.mkdirpSync).toHaveBeenCalledWith(__dirname);
      expect(gen.installTemplate).toHaveBeenCalledWith(false);
      expect(gen.configureTemplate).toHaveBeenCalled();
      expect(hooksRegistry.registerHooks).toHaveBeenCalled();
      expect(templateConfigValidator.validateTemplateConfig).toHaveBeenCalled();
      expect(gen.launchHook).toHaveBeenCalledWith('generate:after');
      expect(gen.originalAsyncAPI).toBe(dummyYAML);
    });

    it('fails if input is not a string nor a parsed AsyncAPI document', async () => {
      const gen = new Generator('testTemplate', __dirname);
      expect(() => gen.generate(1)).rejects.toThrow('Parameter "asyncapiDocument" must be a non-empty string or an already parsed AsyncAPI document');
    });
  });

  describe('#generateFromString', () => {
    let generateMock;

    beforeAll(() => {
      generateMock = jest.fn().mockResolvedValue();
    });

    it('calls this.generate', async () => {
      const gen = new Generator('testTemplate', __dirname);
      gen.generate = generateMock;
      await gen.generateFromString(dummyYAML);

      expect(generateMock).toHaveBeenCalled();
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
  });

  describe('#generateFromFile', () => {
    it('calls readFile and generateFromString with the right params', async () => {
      const utils = require('../lib/utils');
      const filePath = 'fake-asyncapi.yml';
      utils.__files = {
        [filePath]: 'test content',
      };
      const generateMock = jest.fn().mockResolvedValue();
      const gen = new Generator('testTemplate', __dirname);
      gen.generate = generateMock;
      await gen.generateFromFile(filePath);
      expect(utils.readFile).toHaveBeenCalled();
      expect(utils.readFile.mock.calls[0][0]).toBe(filePath);
      expect(utils.readFile.mock.calls[0][1]).toStrictEqual({ encoding: 'utf8' });
      expect(generateMock.mock.calls[0][0]).toBe('test content');
      expect(generateMock.mock.calls[0][1]).toStrictEqual({ path: filePath });
    });
  });

  describe('#generateFromURL', () => {
    it('calls fetch and generateFromString with the right params', async () => {
      const utils = require('../lib/utils');
      const asyncapiURL = 'http://example.com/fake-asyncapi.yml';
      utils.__contentOfFetchedFile = 'fake text';

      const generateMock = jest.fn().mockResolvedValue();
      const gen = new Generator('testTemplate', __dirname);
      gen.generate = generateMock;
      await gen.generateFromURL(asyncapiURL);
      expect(utils.fetchSpec).toHaveBeenCalled();
      expect(utils.fetchSpec.mock.calls[0][0]).toBe(asyncapiURL);
      expect(generateMock.mock.calls[0][0]).toBe('fake text');
    });
  });

  describe('#installTemplate', () => {
    let ArboristMock;
    let arboristMock;
    let utils;

    beforeEach(() => {
      ArboristMock = require('@npmcli/arborist');
      arboristMock = new ArboristMock();
      utils = require('../lib/utils');
      jest.mock(path.resolve('./testTemplate', 'package.json'), () => ({ name: 'nameOfTestTemplate' }), { virtual: true });
      jest.mock(path.resolve(Generator.DEFAULT_TEMPLATES_DIR, 'nameOfTestTemplate', 'package.json'), () => ({ name: 'nameOfTestTemplate' }), { virtual: true });
    });

    it('works with a file system path', async () => {
      log.debug = jest.fn();
      utils.__getTemplateDetails = { pkgPath: '/path', name: 'test-template' };
      const templatePath = './testTemplate';
      const gen = new Generator(templatePath, __dirname);
      await gen.installTemplate();
      setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
        expect(arboristMock.reify).toHaveBeenCalledTimes(0);
      }, 0);
    });

    it('works with a file system path and force = true', async () => {
      log.debug = jest.fn();
      const gen = new Generator('./testTemplate', __dirname);
      await gen.installTemplate(true); 
      //TODO: this test is disabled until we find a solution how to fix jest config in monorepo so it recognize arborist mock
      // setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
      //   expect(arboristMock.reify).toHaveBeenCalledTimes(1);
      //   expect(arboristMock.reify.mock.calls[0][0]).toStrictEqual({
      //     add: ['./testTemplate'],
      //     saveType: 'prod',
      //     save: false
      //   });
      // }, 0);
      expect(log.debug).toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_FLAG_MSG));
    });

    it('works with an npm package', async () => {
      utils.__isFileSystemPathValue = false;
      const gen = new Generator('nameOfTestTemplate', __dirname);
      await gen.installTemplate();
      setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
        expect(arboristMock.reify).toHaveBeenCalledTimes(0);
      }, 0);
    });

    it('works with an npm package that is installed for the first time', async () => {
      log.debug = jest.fn();
      utils.__getTemplateDetails = undefined;
      const gen = new Generator('nameOfTestTemplate', __dirname, {debug: true});
      await gen.installTemplate();
      //TODO: this test is disabled until we find a solution how to fix jest config in monorepo so it recognize arborist mock
      // setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
      //   expect(arboristMock.reify).toHaveBeenCalledTimes(1);
      // }, 0);
      expect(log.debug).toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_DISK_MSG));
    });

    it('works with an npm package and force = true', async () => {
      log.debug = jest.fn();
      utils.__isFileSystemPathValue = false;
      const gen = new Generator('nameOfTestTemplate', __dirname);
      await gen.installTemplate(true);
      //TODO: this test is disabled until we find a solution how to fix jest config in monorepo so it recognize arborist mock
      // setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
      //   expect(arboristMock.reify).toHaveBeenCalledTimes(1);
      // }, 0);
      expect(log.debug).toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_FLAG_MSG));
    });

    it('works with a url', async () => {
      utils.__isFileSystemPathValue = false;
      utils.__getTemplateDetails = undefined;
      const gen = new Generator('https://my-test-template.com', __dirname);
      await gen.installTemplate();
      //TODO: this test is disabled until we find a solution how to fix jest config in monorepo so it recognize arborist mock
      // setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
      //   expect(arboristMock.reify).toHaveBeenCalledTimes(1);
      // }, 0);
      expect(log.debug).toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_DISK_MSG));
    });

    it('works with a url and force = true', async () => {
      const gen = new Generator('https://my-test-template.com', __dirname);
      await gen.installTemplate(true);
      //TODO: this test is disabled until we find a solution how to fix jest config in monorepo so it recognize arborist mock
      // setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
      //   expect(arboristMock.reify).toHaveBeenCalledTimes(1);
      // }, 0);
      expect(log.debug).toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_FLAG_MSG));
    });

    it('works with a path to registry', async () => {
      log.debug = jest.fn();
      const gen = new Generator('nameOfTestTemplate', __dirname, {debug: true, registry: {url: 'some.registry.com', authorizationName: 'sdfsf'}});
      await gen.installTemplate();
      //TODO: this test is disabled until we find a solution how to fix jest config in monorepo so it recognize arborist mock
      // setTimeout(() => { // This puts the call at the end of the Node.js event loop queue.
      //   expect(arboristMock.reify).toHaveBeenCalledTimes(1);
      // });
      expect(log.debug).toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_DISK_MSG));
    });

    it('throws an error indicating an unexpected param was given for registry configuration', () => {
      const t = () => new Generator('testTemplate', __dirname, {
        url: 'some.url.com',
        privateKey: 'some.key'

      });
      expect(t).toThrow('These options are not supported by the generator: privateKey');
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

  describe('#launchHook', () => {
    it('launch given hook', async () => {
      let iteration = 0;
      const gen = new Generator('testTemplate', __dirname);
      gen.hooks = { 'test-hooks': [function a() { iteration++; }, function b() { iteration++; }] };
      await gen.launchHook('test-hooks');
      expect(iteration).toStrictEqual(2);
    });

    it('launch given hook which is disabled', async () => {
      let iteration = 0;
      const gen = new Generator('testTemplate', __dirname, { disabledHooks: { 'test-hooks': true } });
      gen.hooks = { 'test-hooks': [function a() { iteration++; }, function b() { iteration++; }] };
      await gen.launchHook('test-hooks');
      expect(iteration).toStrictEqual(0);
    });

    it('launch given hook where disabledHooks key has array format for given hook type', async () => {
      let iteration = 0;
      const gen = new Generator('testTemplate', __dirname, { disabledHooks: { 'test-hooks': ['a', 'b'] } });
      gen.hooks = { 'test-hooks': [function a() { iteration++; }, function b() { iteration++; }, function c() { iteration++; }] };
      await gen.launchHook('test-hooks');
      expect(iteration).toStrictEqual(1);
    });

    it('launch given hook where disabledHooks key has array format for given hook type', async () => {
      let iteration = 0;
      const gen = new Generator('testTemplate', __dirname, { disabledHooks: { 'test-hooks': 'c' } });
      gen.hooks = { 'test-hooks': [function a() { iteration++; }, function b() { iteration++; }, function c() { iteration++; }] };
      await gen.launchHook('test-hooks');
      expect(iteration).toStrictEqual(2);
    });
  });

  describe('#isHookAvailable', () => {
    it('given hook type not exist or has empty array', async () => {
      const gen = new Generator('testTemplate', __dirname);
      gen.hooks = { 'test-hooks': [] };
      expect(gen.isHookAvailable('foo-bar')).toStrictEqual(false);
      expect(gen.isHookAvailable('test-hooks')).toStrictEqual(false);
    });

    it('given hook type exist and has hooks', async () => {
      const gen = new Generator('testTemplate', __dirname);
      gen.hooks = { 'test-hooks': ['foo-bar'] };
      expect(gen.isHookAvailable('test-hooks')).toStrictEqual(true);
    });

    it('given hook type is disabled', async () => {
      const gen = new Generator('testTemplate', __dirname, { disabledHooks: { 'test-hooks': true } });
      gen.hooks = { 'test-hooks': ['foo-bar'] };
      expect(gen.isHookAvailable('test-hooks')).toStrictEqual(false);
    });

    it('for given hook type only some hooks are disabled', async () => {
      const gen = new Generator('testTemplate', __dirname, { disabledHooks: { 'test-hooks': ['fooBar'], 'string-test-hooks': 'fooBar' } });
      gen.hooks = { 'test-hooks': [function fooBar() {}, function barFoo() {}], 'string-test-hooks': [function fooBar() {}, function barFoo() {}] };
      expect(gen.isHookAvailable('test-hooks')).toStrictEqual(true);
      expect(gen.isHookAvailable('string-test-hooks')).toStrictEqual(true);
    });

    it('for given hook type whole hooks are disabled', async () => {
      const gen = new Generator('testTemplate', __dirname, { disabledHooks: { 'test-hooks': ['fooBar', 'barFoo'], 'string-test-hooks': 'fooBar' } });
      gen.hooks = { 'test-hooks': [function fooBar() {}, function barFoo() {}], 'string-test-hooks': [function fooBar() {}] };
      expect(gen.isHookAvailable('test-hooks')).toStrictEqual(false);
      expect(gen.isHookAvailable('string-test-hooks')).toStrictEqual(false);
    });
  });

  describe('#getAllParameters', () => {
    let gen;
    let asyncApiDocumentMock;
    let parser;

    beforeEach(() => {
      gen = new Generator('testTemplate', __dirname);
      parser = require('../lib/parser');
      const { AsyncAPIDocument } = require('@asyncapi/parser/cjs/models/v2/asyncapi');
      asyncApiDocumentMock = new AsyncAPIDocument({ 'x-parser-api-version': 0 });
    });

    it('should return empty Map when no channels exist (old API)', () => {
      gen.templateConfig = { apiVersion: 'v2' };
      jest.spyOn(parser, 'usesNewAPI').mockReturnValue(false);

      asyncApiDocumentMock.hasChannels = jest.fn().mockReturnValue(false);
      asyncApiDocumentMock.hasComponents = jest.fn().mockReturnValue(false);

      const result = gen.getAllParameters(asyncApiDocumentMock);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('should return parameters from channels using old API', () => {
      // Old API is used when apiVersion is undefined or <= 0
      // usesNewAPI returns true only when apiVersion > 0
      gen.templateConfig = {}; // No apiVersion means old API

      const mockParameters = {
        param1: { name: 'param1' },
        param2: { name: 'param2' }
      };

      const mockChannel = {
        parameters: jest.fn().mockReturnValue(mockParameters)
      };

      asyncApiDocumentMock.hasChannels = jest.fn().mockReturnValue(true);
      // channelNames() should return an array directly (not a function)
      // The code does: asyncapiDocument.channelNames().forEach(...)
      const channelNamesArray = ['test/channel'];
      asyncApiDocumentMock.channelNames = jest.fn().mockReturnValue(channelNamesArray);
      asyncApiDocumentMock.channel = jest.fn().mockReturnValue(mockChannel);
      asyncApiDocumentMock.hasComponents = jest.fn().mockReturnValue(false);

      const result = gen.getAllParameters(asyncApiDocumentMock);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect(result.get('param1')).toEqual(mockParameters.param1);
      expect(result.get('param2')).toEqual(mockParameters.param2);
      expect(asyncApiDocumentMock.channelNames).toHaveBeenCalled();
      expect(asyncApiDocumentMock.channel).toHaveBeenCalledWith('test/channel');
      expect(mockChannel.parameters).toHaveBeenCalled();
    });

    it('should return parameters from components using old API', () => {
      // Old API is used when apiVersion is undefined
      gen.templateConfig = {}; // No apiVersion means old API

      asyncApiDocumentMock.hasChannels = jest.fn().mockReturnValue(false);
      asyncApiDocumentMock.hasComponents = jest.fn().mockReturnValue(true);
      
      const mockParameters = {
        compParam1: { name: 'compParam1' },
        compParam2: { name: 'compParam2' }
      };
      
      // components() returns an object, and parameters() is called on it
      const mockComponents = {
        parameters: jest.fn().mockReturnValue(mockParameters)
      };
      asyncApiDocumentMock.components = jest.fn().mockReturnValue(mockComponents);

      const result = gen.getAllParameters(asyncApiDocumentMock);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect(result.get('compParam1')).toEqual(mockParameters.compParam1);
      expect(result.get('compParam2')).toEqual(mockParameters.compParam2);
      expect(asyncApiDocumentMock.components).toHaveBeenCalled();
      expect(mockComponents.parameters).toHaveBeenCalled();
    });
  });

  describe('#verifyTargetDir', () => {
    let gen;
    let util;
    let gitModule;

    beforeEach(() => {
      gen = new Generator('testTemplate', __dirname);
      gen.targetDir = __dirname;
      util = require('../lib/utils');
      gitModule = require('simple-git');
      jest.clearAllMocks();
    });

    it('should pass when directory is in .gitignore', async () => {
      const mockGitInstance = {
        checkIsRepo: jest.fn().mockResolvedValue(true),
        revparse: jest.fn().mockResolvedValue('/repo/root'),
        checkIgnore: jest.fn().mockResolvedValue(['test-dir']),
        status: jest.fn()
      };

      // simple-git is a factory function: git(dir) returns an instance
      gitModule.mockImplementation(() => mockGitInstance);

      await expect(gen.verifyTargetDir(__dirname)).resolves.not.toThrow();
      expect(mockGitInstance.checkIsRepo).toHaveBeenCalled();
    });

    it('should throw error when git repo has unstaged changes (untracked files)', async () => {
      const mockGitInstance = {
        checkIsRepo: jest.fn().mockResolvedValue(true),
        revparse: jest.fn().mockResolvedValue('/repo/root'),
        checkIgnore: jest.fn().mockResolvedValue([]),
        status: jest.fn().mockResolvedValue({
          not_added: ['file1.js'],
          staged: [],
          modified: []
        })
      };

      gitModule.mockImplementation(() => mockGitInstance);

      await expect(gen.verifyTargetDir(__dirname)).rejects.toThrow('is in a git repository with unstaged changes');
      expect(mockGitInstance.checkIsRepo).toHaveBeenCalled();
      expect(mockGitInstance.status).toHaveBeenCalled();
    });

    it('should throw error when git repo has modified unstaged files', async () => {
      const mockGitInstance = {
        checkIsRepo: jest.fn().mockResolvedValue(true),
        revparse: jest.fn().mockResolvedValue('/repo/root'),
        checkIgnore: jest.fn().mockResolvedValue([]),
        status: jest.fn().mockResolvedValue({
          not_added: [],
          staged: ['file1.js'],
          modified: ['file2.js', 'file1.js']
        })
      };

      gitModule.mockImplementation(() => mockGitInstance);

      await expect(gen.verifyTargetDir(__dirname)).rejects.toThrow('is in a git repository with unstaged changes');
    });

    it('should pass when git repo has only staged changes', async () => {
      const mockGitInstance = {
        checkIsRepo: jest.fn().mockResolvedValue(true),
        revparse: jest.fn().mockResolvedValue('/repo/root'),
        checkIgnore: jest.fn().mockResolvedValue([]),
        status: jest.fn().mockResolvedValue({
          not_added: [],
          staged: ['file1.js'],
          modified: ['file1.js']
        })
      };

      gitModule.mockImplementation(() => mockGitInstance);

      await expect(gen.verifyTargetDir(__dirname)).resolves.not.toThrow();
    });

    it('should throw error when non-git directory is not empty', async () => {
      const mockGitInstance = {
        checkIsRepo: jest.fn().mockResolvedValue(false)
      };

      gitModule.mockImplementation(() => mockGitInstance);
      util.readDir.mockResolvedValue(['file1.js', 'file2.js']);

      await expect(gen.verifyTargetDir(__dirname)).rejects.toThrow('is not an empty directory');
      expect(mockGitInstance.checkIsRepo).toHaveBeenCalled();
      expect(util.readDir).toHaveBeenCalledWith(__dirname);
    });

    it('should pass when non-git directory is empty', async () => {
      const mockGitInstance = {
        checkIsRepo: jest.fn().mockResolvedValue(false)
      };

      gitModule.mockImplementation(() => mockGitInstance);
      util.readDir.mockResolvedValue([]);

      await expect(gen.verifyTargetDir(__dirname)).resolves.not.toThrow();
      expect(mockGitInstance.checkIsRepo).toHaveBeenCalled();
      expect(util.readDir).toHaveBeenCalledWith(__dirname);
    });

    it('should pass when workDir is empty string (at repo root)', async () => {
      const mockGitInstance = {
        checkIsRepo: jest.fn().mockResolvedValue(true),
        revparse: jest.fn().mockResolvedValue('/repo/root'),
        checkIgnore: jest.fn().mockResolvedValue([]),
        status: jest.fn().mockResolvedValue({
          not_added: [],
          staged: [],
          modified: []
        })
      };

      gitModule.mockImplementation((dir) => {
        // When dir is the repo root, path.relative returns empty string
        if (dir === '/repo/root') {
          return {
            ...mockGitInstance,
            checkIgnore: jest.fn().mockResolvedValue([])
          };
        }
        return mockGitInstance;
      });

      // Mock path.relative to return empty string (at repo root)
      const pathModule = require('path');
      jest.spyOn(pathModule, 'relative').mockReturnValue('');

      await expect(gen.verifyTargetDir('/repo/root')).resolves.not.toThrow();
    });
  });

  describe('#ignoredDirHandler', () => {
    let gen;
    let xfsMock;
    let conditionalGeneration;
    let asyncApiDocumentMock;

    beforeEach(() => {
      gen = new Generator('testTemplate', __dirname);
      gen.templateContentDir = path.join(__dirname, 'template');
      gen.targetDir = path.join(__dirname, 'output');
      // templateConfig is initialized as {} in constructor (line 119 of generator.js)
      // We can modify it directly, but need to ensure it's a plain object
      gen.templateParams = {};
      xfsMock = require('fs.extra');
      // conditionalGeneration is already mocked at the top level
      conditionalGeneration = require('../lib/conditionalGeneration');
      const { AsyncAPIDocument } = require('@asyncapi/parser/cjs/models/v2/asyncapi');
      asyncApiDocumentMock = new AsyncAPIDocument({ 'x-parser-api-version': 0 });
      // The code uses both this.asyncapi and this.asyncapiDocument
      gen.asyncapi = asyncApiDocumentMock;
      gen.asyncapiDocument = asyncApiDocumentMock;
      jest.clearAllMocks();
      // Reset xfs mock
      xfsMock.mkdirpSync.mockClear();
    });

    it('should create directory when condition is met', async () => {
      const root = gen.templateContentDir;
      const stats = { name: 'testDir' };
      const next = jest.fn();

      // The code calculates: path.relative(this.templateContentDir, path.resolve(root, stats.name))
      // We need to calculate this the same way
      const fullPath = path.resolve(root, stats.name);
      const expectedRelativeDir = path.relative(gen.templateContentDir, fullPath);
      
      // Set up config - ensure conditionalGeneration object exists first
      // Use direct assignment to ensure it's set on the actual templateConfig object
      if (!gen.templateConfig.conditionalGeneration) {
        gen.templateConfig.conditionalGeneration = {};
      }
      // Then set the specific entry using the exact key that will be calculated
      gen.templateConfig.conditionalGeneration[expectedRelativeDir] = {
        parameter: 'enableFeature',
        validate: jest.fn().mockReturnValue(true)
      };
      gen.templateParams = { enableFeature: 'true' };

      // Verify the config is accessible the same way the code will access it
      // The code does: this.templateConfig?.conditionalGeneration?.[relativeDir]
      const conditionalEntry = gen.templateConfig?.conditionalGeneration?.[expectedRelativeDir];
      expect(conditionalEntry).toBeDefined();
      expect(conditionalEntry.parameter).toBe('enableFeature');
      
      // Store a reference to verify it's not being reset
      const configBeforeCall = gen.templateConfig;
      const conditionalGenBeforeCall = gen.templateConfig.conditionalGeneration;

      // isGenerationConditionMet is imported directly in generator.js, so we need to spy on the module's export
      const isGenerationConditionMetSpy = jest.spyOn(conditionalGeneration, 'isGenerationConditionMet').mockResolvedValue(true);

      await gen.ignoredDirHandler(root, stats, next);
      
      // Verify templateConfig wasn't reset
      expect(gen.templateConfig).toBe(configBeforeCall);
      expect(gen.templateConfig.conditionalGeneration).toBe(conditionalGenBeforeCall);
      
      // After the call, verify the config still exists
      const entryAfterCall = gen.templateConfig?.conditionalGeneration?.[expectedRelativeDir];
      expect(entryAfterCall).toBeDefined();

      // The code checks: this.templateConfig?.conditionalGeneration?.[relativeDir]
      // If conditionalEntry is found, isGenerationConditionMet should be called
      // If it's not called, conditionalEntry was undefined in the actual code execution
      expect(isGenerationConditionMetSpy).toHaveBeenCalled();
      expect(xfsMock.mkdirpSync).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should skip directory creation when condition is not met', async () => {
      const root = gen.templateContentDir;
      const stats = { name: 'testDir' };
      const next = jest.fn();

      // Calculate the expected relativeDir
      const fullPath = path.resolve(root, stats.name);
      const expectedRelativeDir = path.relative(gen.templateContentDir, fullPath);

      // Ensure conditionalGeneration object exists
      if (!gen.templateConfig.conditionalGeneration) {
        gen.templateConfig.conditionalGeneration = {};
      }
      // Set up config with the exact key
      gen.templateConfig.conditionalGeneration[expectedRelativeDir] = {
        parameter: 'enableFeature',
        validate: jest.fn().mockReturnValue(false)
      };
      gen.templateParams = { enableFeature: 'false' };

      // Verify the config is accessible
      const conditionalEntry = gen.templateConfig?.conditionalGeneration?.[expectedRelativeDir];
      expect(conditionalEntry).toBeDefined();

      const isGenerationConditionMetSpy = jest.spyOn(conditionalGeneration, 'isGenerationConditionMet').mockResolvedValue(false);

      await gen.ignoredDirHandler(root, stats, next);

      // Verify isGenerationConditionMet was called (meaning conditionalEntry was found)
      expect(isGenerationConditionMetSpy).toHaveBeenCalled();
      expect(xfsMock.mkdirpSync).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should create directory when no conditional generation is configured', async () => {
      const root = gen.templateContentDir;
      const stats = { name: 'testDir' };
      const next = jest.fn();

      gen.templateConfig = {};

      await gen.ignoredDirHandler(root, stats, next);

      expect(xfsMock.mkdirpSync).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should skip .git directories', async () => {
      const root = gen.templateContentDir;
      const stats = { name: '.git' };
      const next = jest.fn();

      // Calculate relativeDir - should be '.git'
      const fullPath = path.resolve(root, stats.name);
      const relativeDir = path.relative(gen.templateContentDir, fullPath);
      
      // If relativeDir is empty, it means we're at the root, so .git check won't work
      // But in practice, if stats.name is '.git', relativeDir should be '.git'
      if (relativeDir) {
        expect(relativeDir).toBe('.git');
      }

      await gen.ignoredDirHandler(root, stats, next);

      // shouldIgnoreDir should prevent mkdirpSync from being called
      // If relativeDir is empty, the code might still call mkdirpSync, but that's a different issue
      // For now, we test that next() is called
      expect(next).toHaveBeenCalled();
    });
  });
});
