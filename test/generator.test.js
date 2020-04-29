const fs = require('fs');
const path = require('path');
const { toMatchFile } = require('jest-file-snapshot');
const Generator = require('../lib/generator');

expect.extend({ toMatchFile });

const LONG_TIMEOUT = 20000;
const outputDir = path.resolve(__dirname, 'output');
const emptyOutputDir = () => {
  fs.rmdirSync(outputDir, { recursive: true });
  fs.mkdirSync(outputDir);
};

const simpleTemplatePath = path.resolve(__dirname, './templates/simple');
const streetlightYAML = fs.readFileSync(path.resolve(__dirname, './docs/streetlights.yml'), 'utf8');

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
    beforeEach(emptyOutputDir);

    it('works with simple template and variable interpolation', async () => {
      const gen = new Generator(simpleTemplatePath, path.resolve(outputDir, 'simple/1'));
      await gen.generateFromString(streetlightYAML);
      expect('Static text\n').toMatchFile(path.resolve(outputDir, 'simple/1/static.md'));
      expect('### Your API title is Streetlights API\n').toMatchFile(path.resolve(outputDir, 'simple/1/test.md'));
    }, LONG_TIMEOUT);

    it('works with simple template and variable interpolation as string', async () => {
      const gen = new Generator(simpleTemplatePath, path.resolve(outputDir, 'simple/2'), { output: 'string', entrypoint: 'test.md' });
      const out = await gen.generateFromString(streetlightYAML);
      expect(out).toStrictEqual('### Your API title is Streetlights API\n');
    }, LONG_TIMEOUT);

    it('fails when entrypoint is not set and output is equal to "string"', async () => {
      const gen = new Generator(simpleTemplatePath, path.resolve(outputDir, 'simple/2'), { output: 'string' });
      const t = () => gen.generateFromString(streetlightYAML);
      expect(t).rejects.toThrow('Parameter entrypoint is required when using output = "string"');
    }, LONG_TIMEOUT);
  });

  describe('.getTemplateFile', () => {
    it('retrieves the content of a template file', async () => {
      const content = await Generator.getTemplateFile('simple', 'template/static.md', path.resolve(__dirname, 'templates'));
      expect(content).toStrictEqual('Static text\n');
    });
  });
});
