/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const { promises: fsPromise } = require('fs');
const { readFileSync} = require('fs');
const Generator = require('../lib/generator');
const dummySpecPath = path.resolve(__dirname, './docs/dummy.yml');
const refSpecPath = path.resolve(__dirname, './docs/apiwithref.json');
const refSpecFolder = path.resolve(__dirname, './docs/');
const crypto = require('crypto');
const mainTestResultPath = 'test/temp/integrationTestResult';
const reactTemplate = 'test/test-templates/react-template';
const nunjucksTemplate = 'test/test-templates/nunjucks-template';

describe('Integration testing generateFromFile() to make sure the result of the generation is not changend comparing to snapshot', () => {
  const generateFolderName = () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(60000);
  const testOutputFile = 'test-file.md';

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
    const file = await readFile(path.join(outputDir, testOutputFile), 'utf8');
    expect(file).toMatchSnapshot();
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
    // const logSpyDebug = jest.spyOn(console, 'log').mockImplementation(() => {});
    const outputDir = generateFolderName();
    await fsPromise.mkdir(outputDir, { recursive: true });
  
    // Create temp.md.js file dynamically
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
    const tempJsPath = path.join(reactTemplate, 'temp.md.js');
    await fsPromise.writeFile(tempJsPath, tempJsContent);
  
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true,
      compile: true,
      debug: true
    });
    await generator.generateFromFile(dummySpecPath);
  
    // Check if temp.md is created in the output directory
    const tempMdPath = path.join(outputDir, 'temp.md');
    const tempMdExists = await fsPromise.access(tempMdPath).then(() => true).catch(() => false);
    expect(tempMdExists).toBe(true);
  
    // Check the content of temp.md
    if (tempMdExists) {
      const tempMdContent = await fsPromise.readFile(tempMdPath, 'utf8');
      expect(tempMdContent.trim()).toBe('Test');
    }
  
    // Clean up: remove the dynamically created temp.md.js file
    await fsPromise.unlink(tempJsPath);
  
    logSpyDebug.mockRestore();
  });

  it('check if the temp.md file is not created when compile option is false', async () => {
    jest.setTimeout(120000); 
    const logSpyDebug = jest.spyOn(console, 'log').mockImplementation(() => {});
    const outputDir = generateFolderName();
    await fsPromise.mkdir(outputDir, { recursive: true });
  
    // Create temp.md.js file dynamically
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
    const tempJsPath = path.join(reactTemplate, 'temp.md.js');
    await fsPromise.writeFile(tempJsPath, tempJsContent);
  
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true,
      compile: false, 
      debug: true
    });
    await generator.generateFromFile(dummySpecPath);
  
    // Check if temp.md is not created in the output directory
    const tempMdPath = path.join(outputDir, 'temp.md');
    const tempMdExists = await fsPromise.access(tempMdPath).then(() => true).catch(() => false);
    expect(tempMdExists).toBe(false);
  
    // Clean up: remove the dynamically created temp.md.js file
    await fsPromise.unlink(tempJsPath);
  
    logSpyDebug.mockRestore();
  });
});
