/**
 * @jest-environment node
 */

const path = require('path');
const { readFile, writeFile, access, mkdir } = require('fs').promises;
const { copy } = require('fs-extra');
const Generator = require('../lib/generator');
const dummySpecPath = path.resolve(__dirname, './docs/dummy.yml');
const refSpecPath = path.resolve(__dirname, './docs/apiwithref.json');
const refSpecFolder = path.resolve(__dirname, './docs/');
const crypto = require('crypto');
const fs = require('fs');
const mainTestResultPath = path.resolve(__dirname, './temp/integrationTestResult');
const reactTemplate = path.resolve(__dirname, './test-templates/react-template');
const nunjucksTemplate = path.resolve(__dirname, './test-templates/nunjucks-template');
//temp location where react template is copied for each test that does some mutation on template files
const copyOfReactTemplate = path.resolve(__dirname, './temp/reactTemplate');

describe('Integration testing generateFromFile() to make sure the result of the generation is not changend comparing to snapshot', () => {
  const generateFolderName = () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
  };

  const getCleanReactTemplate = async () => {
    //for each test new react template is needed in unique location
    const newReactTemplateLocation = path.resolve(copyOfReactTemplate, crypto.randomBytes(4).toString('hex'));
    await copy(reactTemplate, newReactTemplateLocation);
    return newReactTemplateLocation;
  };

  jest.setTimeout(100000);
  const testOutputFile = 'test-file.md';

  const tempJsContent = `
  import { File, Text } from '@asyncapi/generator-react-sdk';
  
  export default function() {
    return (
      <File name="temp.md">
        <Text>Test</Text>
      </File>
    );
  }
  `;

  it('generated using Nunjucks template', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(nunjucksTemplate, outputDir, {
      forceWrite: true,
      templateParams: { version: 'v1', mode: 'production' }
    });
    await generator.generateFromFile(dummySpecPath);
    const file = await readFile(path.join(outputDir, testOutputFile), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('generate using React template', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production' }
    });
    await generator.generateFromFile(dummySpecPath);
    const mdFile = await readFile(path.join(outputDir, testOutputFile), 'utf8');
    //react template has hooks lib enabled and generation of asyncapi document that was passed as input should work out of the box without adding @asyncapi/generator-hooks to dependencies
    const asyncAPIFile = await readFile(path.join(outputDir, 'asyncapi.yaml'), 'utf8');
    expect(mdFile).toMatchSnapshot();
    expect(asyncAPIFile).toMatchSnapshot();
  });

  it('generate json based api with referenced JSON Schema', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      mapBaseUrlToFolder: { url: 'https://schema.example.com/crm/', folder: `${refSpecFolder}/`},
      forceWrite: true,
      templateParams: { version: 'v1', mode: 'production' }
    });
    await generator.generateFromFile(refSpecPath);
    const file = await readFile(path.join(outputDir, testOutputFile), 'utf8');
    expect(file).toMatchSnapshot();
  });

  it('check if the temp.md file is created with compile option true', async () => {
    const outputDir = generateFolderName();
    const cleanReactTemplate = await getCleanReactTemplate();
    // Create temp.md.js file dynamically

    const tempJsPath = path.join(cleanReactTemplate, 'template/temp.md.js');
    // Create temp.md.js file dynamically
    await writeFile(tempJsPath, tempJsContent);

    const generator = new Generator(cleanReactTemplate, outputDir, {
      forceWrite: true,
      compile: true,
      debug: true,
    });
    await generator.generateFromFile(dummySpecPath);

    const tempMdPath = path.join(outputDir, 'temp.md');

    // Check the content of temp.md
    const tempMdContent = await readFile(tempMdPath, 'utf8');
    expect(tempMdContent.trim()).toBe('Test');
  });

  it('check if the temp.md file is not created when compile option is false', async () => {
    const outputDir = generateFolderName();
    const cleanReactTemplate = await getCleanReactTemplate();
    // Create temp.md.js file dynamically
    const tempJsPath = path.join(cleanReactTemplate, 'template/temp.md.js');
    await writeFile(tempJsPath, tempJsContent);
  
    const generator = new Generator(cleanReactTemplate, outputDir, {
      forceWrite: true,
      compile: false, 
      debug: true
    });
    await generator.generateFromFile(dummySpecPath);
  
    // Check if temp.md is not created in the output directory
    const tempMdPath = path.join(outputDir, 'temp.md');
    const tempMdExists = await access(tempMdPath).then(() => true).catch(() => false);
    expect(tempMdExists).toBe(false);
  });

  it('should ignore specified files with noOverwriteGlobs', async () => {
    const outputDir = generateFolderName();
    const cleanReactTemplate = await getCleanReactTemplate();
    // Manually create a file to test if it's not overwritten
    await mkdir(outputDir, { recursive: true });
    // Create a variable to store the file content
    const testContent = '<script>const initialContent = "This should not change";</script>';
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const testFilePath = path.normalize(path.resolve(outputDir, testOutputFile));
    await writeFile(testFilePath, testContent);

    // Manually create an output first, before generation, with additional custom file to validate if later it is still there, not overwritten
    const generator = new Generator(cleanReactTemplate, outputDir, {
      forceWrite: true,
      noOverwriteGlobs: [`**/${testOutputFile}`],
      debug: true,
    });

    await generator.generateFromFile(dummySpecPath);

    // Read the file to confirm it was not overwritten
    const fileContent = await readFile(testFilePath, 'utf8');
    // Check if the files have been overwritten
    expect(fileContent).toBe(testContent);
    // Check if the log debug message was printed
    /*TODO:
       Include log message test in the future to ensure that the log.debug for skipping overwrite is called
     */
  });

  it('should not generate the conditionalFolder if the singleFile parameter is set true', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production', singleFile: true }
    });
    await generator.generateFromFile(dummySpecPath);
    const conditionalFolderPath = path.join(outputDir, 'conditionalFolder');
    const exists = fs.existsSync(conditionalFolderPath);
    expect(exists).toBe(false);
  });
  
  it('should generate the conditionalFolder if the singleFile parameter is set false by default', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production' }
    });
    await generator.generateFromFile(dummySpecPath);
    const conditionalFolderPath = path.join(outputDir, 'conditionalFolder');
    const exists = fs.existsSync(conditionalFolderPath);
    expect(exists).toBe(true);
  });

  it('should not generate the conditionalFolder in one by one process in a single folder, if the singleFile parameter is set true', async () => {
    const outputDir = generateFolderName();
    for (let i = 1; i <= 3; i++) {
      const generator = new Generator(reactTemplate, outputDir, {
        forceWrite: true ,
        templateParams: { version: 'v1', mode: 'production', singleFile: true}
      });
      await generator.generateFromFile(dummySpecPath);
    }
    const conditionalFolderPath = path.join(outputDir, 'conditionalFolder');
    const exists = fs.existsSync(conditionalFolderPath);
    expect(exists).toBe(false);
  });

  it('should not generate the conditionalFolder when generating multiple times sequentially into the same folder with singleFile set to true', async () => {
    const outputDir = generateFolderName();
    const promises = [];
  
    for (let i = 1; i <= 3; i++) {
      const generator = new Generator(reactTemplate, outputDir, {
        forceWrite: true,
        templateParams: { version: 'v1', mode: 'production', singleFile: true }
      });
      promises.push(generator.generateFromFile(dummySpecPath));
    }
  
    await Promise.all(promises);
  
    const conditionalFolderPath = path.join(outputDir, 'conditionalFolder');
    const exists = fs.existsSync(conditionalFolderPath);
  
    expect(exists).toBe(false);
  });
});
