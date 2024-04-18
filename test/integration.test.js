/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('../lib/generator');
const dummySpecPath = path.resolve(__dirname, './docs/dummy.yml');
const refSpecPath = path.resolve(__dirname, './docs/apiwithref.json');
const refSpecFolder = path.resolve(__dirname, './docs/');
const crypto = require('crypto');
const {mkdirSync} = require('fs');
const {exists, writeFile} = require('../lib/utils');
const mainTestResultPath = 'test/temp/integrationTestResult';
//we do not want to download chromium for html-template if it is not needed
process.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] = true;

describe('Integration testing generateFromFile() to make sure the result of the generation is not changend comparing to snapshot', () => {
  const generateFolderName = () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(60000);

  it('generated using Nunjucks template', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator('@asyncapi/html-template@0.18.0', outputDir, { forceWrite: true, templateParams: { singleFile: true } });
    await generator.generateFromFile(dummySpecPath);
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('generate using React template', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator('@asyncapi/markdown-template@0.13.0', outputDir, { forceWrite: true });
    await generator.generateFromFile(dummySpecPath);
    const file = await readFile(path.join(outputDir, 'asyncapi.md'), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('generate json based api with referenced JSON Schema', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator('@asyncapi/html-template@0.18.0', outputDir, {
      mapBaseUrlToFolder: { url: 'https://schema.example.com/crm/', folder: `${refSpecFolder}/`},
      forceWrite: true,
      templateParams: { singleFile: true }
    });
    await generator.generateFromFile(refSpecPath);
    const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('should ignore specified files with noOverwriteGlobs', async () => {
    const outputDir = generateFolderName();
    // Manually create a file to test if it's not overwritten
    if (!await exists(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const testFilePath = path.join(outputDir, 'index.html');
    await writeFile(testFilePath, '<script>const initialContent = "This should not change";</script>');

    // based on the html-template documentation, the default output is index.html
    const generator = new Generator('@asyncapi/html-template@0.28.0', outputDir, {
      forceWrite: true,
      noOverwriteGlobs: ['**/index.html']
    });

    await generator.generateFromFile(dummySpecPath);

    // Read the file to confirm it was not overwritten
    const fileContent = await readFile(testFilePath, 'utf8');
    expect(fileContent).toBe('<script>const initialContent = "This should not change";</script>');
  });
});
