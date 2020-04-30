/* eslint-disable sonarjs/no-duplicate-string */
const fs = require('fs');
const path = require('path');
const Generator = require('../lib/generator');

const streetlightYAML = fs.readFileSync(path.resolve(__dirname, './docs/streetlights.yml'), 'utf8');

jest.mock('../lib/utils');

describe('Generator', () => {
  describe('constructor', () => {
    it('works with minimum amount of params', () => {
      const gen = new Generator('myTemplate', __dirname);
      expect(gen.templateName).toStrictEqual('myTemplate');
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
      const gen = new Generator('myTemplate', __dirname, {
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
      expect(gen.templateName).toStrictEqual('myTemplate');
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
      const t = () => new Generator('myTemplate');
      expect(t).toThrow('No target directory has been specified.');
    });

    it('fails if output is given and is different than "fs" and "string"', () => {
      const t = () => new Generator('myTemplate', __dirname, { output: 'fail' });
      expect(t).toThrow('Invalid output type fail. Valid values are \'fs\' and \'string\'.');
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
      const gen = new Generator('myTemplate', __dirname);
      gen.generate = generateMock;
      await gen.generateFromString(streetlightYAML);

      expect(generateMock.mock.calls.length).toBe(1);
      expect(parserMock.parse.mock.calls.length).toBe(1);
      expect(parserMock.parse.mock.calls[0][0]).toBe(streetlightYAML);
      expect(parserMock.parse.mock.calls[0][1]).toStrictEqual({});
    });

    it('calls parser.parse with the right options', async () => {
      const gen = new Generator('myTemplate', __dirname);
      const fakeOptions = { test: true };
      gen.generate = generateMock;
      await gen.generateFromString(streetlightYAML, fakeOptions);

      expect(parserMock.parse.mock.calls.length).toBe(1);
      expect(parserMock.parse.mock.calls[0][0]).toBe(streetlightYAML);
      expect(parserMock.parse.mock.calls[0][1]).toStrictEqual(fakeOptions);
    });

    it('fails if asyncapiString is not provided', async () => {
      const gen = new Generator('myTemplate', __dirname);
      gen.generate = generateMock;
      expect(() => gen.generateFromString()).rejects.toThrow('Parameter "asyncapiString" must be a non-empty string.');
    });

    it('fails if asyncapiString is not a string', async () => {
      const gen = new Generator('myTemplate', __dirname);
      gen.generate = generateMock;
      expect(() => gen.generateFromString(1)).rejects.toThrow('Parameter "asyncapiString" must be a non-empty string.');
    });

    it('stores the original asyncapi document', async () => {
      const gen = new Generator('myTemplate', __dirname);
      gen.generate = generateMock;
      await gen.generateFromString(streetlightYAML);
      expect(gen.originalAsyncAPI).toBe(streetlightYAML);
    });
  });

  describe('.getTemplateFile', () => {
    it('retrieves the content of a template file', async () => {
      const utils = require('../lib/utils');
      const filePath = path.resolve(Generator.DEFAULT_TEMPLATES_DIR, 'simple', 'template/static.md');
      utils.__files__ = {
        [filePath]: 'test content',
      };
      const content = await Generator.getTemplateFile('simple', 'template/static.md');
      expect(utils.readFile.mock.calls.length).toBe(1);
      expect(utils.readFile.mock.calls[0][0]).toBe(filePath);
      expect(content).toBe(utils.__files__[filePath]);
    });

    it('retrieves the content of a template file overriding the default template dir', async () => {
      const utils = require('../lib/utils');
      const filePath = path.resolve('~', 'templates', 'simple', 'template/static.md');
      utils.__files__ = {
        [filePath]: 'test content',
      };
      const content = await Generator.getTemplateFile('simple', 'template/static.md', path.resolve('~', 'templates'));
      expect(utils.readFile.mock.calls.length).toBe(1);
      expect(utils.readFile.mock.calls[0][0]).toBe(filePath);
      expect(content).toBe(utils.__files__[filePath]);
    });
  });
});
