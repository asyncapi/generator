/**
 * @jest-environment node
 */

const path = require('path');
const { readFile, writeFile, access, mkdir } = require('fs').promises;
const { copy } = require('fs-extra');
const Generator = require('../lib/generator');
const log = require('loglevel');
const logMessage = require('../lib/logMessages');
const dummySpecPath = path.resolve(__dirname, './docs/dummy.yml');
const refSpecPath = path.resolve(__dirname, './docs/apiwithref.json');
const refSpecFolder = path.resolve(__dirname, './docs/');
const crypto = require('crypto');
const mainTestResultPath = path.resolve(__dirname, './temp/integrationTestResult');
const reactTemplate = path.resolve(__dirname, './test-templates/react-template');
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
  const asyncapiYamlFile = 'asyncapi.yaml';
  const tempOutputFile = 'temp.md';
  const tempJsFile = 'template/temp.md.js';

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

  it('generate using React template', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production' }
    });
    await generator.generateFromFile(dummySpecPath);
    const mdFile = await readFile(path.join(outputDir, testOutputFile), 'utf8');
    //react template has hooks lib enabled and generation of asyncapi document that was passed as input should work out of the box without adding @asyncapi/generator-hooks to dependencies
    const asyncAPIFile = await readFile(path.join(outputDir, asyncapiYamlFile), 'utf8');
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

    const tempJsPath = path.join(cleanReactTemplate, tempJsFile);
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
    const tempJsPath = path.join(cleanReactTemplate, tempJsFile);
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

  it('should ignore specified files with noOverwriteGlobs and log debug message', async () => {
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

    jest.spyOn(generator, 'setLogLevel').mockImplementation(() => {});
    const logSpy = jest.spyOn(log, 'debug');

    try {
      await generator.generateFromFile(dummySpecPath);

      // Read the file to confirm it was not overwritten
      const fileContent = await readFile(testFilePath, 'utf8');
      // Check if the files have been overwritten
      expect(fileContent).toBe(testContent);
      // Check if the log debug message was printed
      expect(logSpy).toHaveBeenCalledWith(logMessage.skipOverwrite(testFilePath));
    } finally {
      logSpy.mockRestore();
    }
  });

  it('should support multiple patterns in noOverwriteGlobs and preserve all matching files', async () => {
    const outputDir = generateFolderName();
    const cleanReactTemplate = await getCleanReactTemplate();
    await mkdir(outputDir, { recursive: true });

    // Dynamically add temp.md.js to template so it generates temp.md as well
    const tempJsPath = path.join(cleanReactTemplate, tempJsFile);
    await writeFile(tempJsPath, tempJsContent);

    const mdContent = 'custom markdown content that should not be overwritten';
    const tempContent = 'custom temp content that should not be overwritten';
    const mdFilePath = path.normalize(path.resolve(outputDir, testOutputFile));
    const tempFilePath = path.normalize(path.resolve(outputDir, tempOutputFile));

    await writeFile(mdFilePath, mdContent);
    await writeFile(tempFilePath, tempContent);

    const generator = new Generator(cleanReactTemplate, outputDir, {
      forceWrite: true,
      noOverwriteGlobs: [`**/${testOutputFile}`, `**/${tempOutputFile}`],
      debug: true,
    });

    jest.spyOn(generator, 'setLogLevel').mockImplementation(() => {});
    const logSpy = jest.spyOn(log, 'debug');

    try {
      await generator.generateFromFile(dummySpecPath);

      const actualMd = await readFile(mdFilePath, 'utf8');
      const actualTemp = await readFile(tempFilePath, 'utf8');

      expect(actualMd).toBe(mdContent);
      expect(actualTemp).toBe(tempContent);
      expect(logSpy).toHaveBeenCalledWith(logMessage.skipOverwrite(mdFilePath));
      expect(logSpy).toHaveBeenCalledWith(logMessage.skipOverwrite(tempFilePath));
    } finally {
      logSpy.mockRestore();
    }
  });

  it('should overwrite files not matching noOverwriteGlobs while preserving matching ones', async () => {
    const outputDir = generateFolderName();
    const cleanReactTemplate = await getCleanReactTemplate();
    await mkdir(outputDir, { recursive: true });

    // Dynamically add temp.md.js to template
    const tempJsPath = path.join(cleanReactTemplate, tempJsFile);
    await writeFile(tempJsPath, tempJsContent);

    const protectedContent = 'protected content';
    const unprotectedInitialContent = 'initial content that SHOULD be overwritten';
    const protectedFilePath = path.normalize(path.resolve(outputDir, testOutputFile));
    const unprotectedFilePath = path.normalize(path.resolve(outputDir, tempOutputFile));

    await writeFile(protectedFilePath, protectedContent);
    await writeFile(unprotectedFilePath, unprotectedInitialContent);

    const generator = new Generator(cleanReactTemplate, outputDir, {
      forceWrite: true,
      noOverwriteGlobs: [`**/${testOutputFile}`],
      debug: true,
    });

    jest.spyOn(generator, 'setLogLevel').mockImplementation(() => {});
    const logSpy = jest.spyOn(log, 'debug');

    try {
      await generator.generateFromFile(dummySpecPath);

      const actualProtected = await readFile(protectedFilePath, 'utf8');
      const actualUnprotected = await readFile(unprotectedFilePath, 'utf8');

      // Protected file is not overwritten
      expect(actualProtected).toBe(protectedContent);
      expect(logSpy).toHaveBeenCalledWith(logMessage.skipOverwrite(protectedFilePath));

      // Unprotected file IS overwritten with generated template content ("Test")
      expect(actualUnprotected).not.toBe(unprotectedInitialContent);
      expect(actualUnprotected.trim()).toBe('Test');
    } finally {
      logSpy.mockRestore();
    }
  });

  it('should not generate the conditionalFolder if the singleFolder parameter is set true', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production', singleFolder: 'true' }
    });
    await generator.generateFromFile(dummySpecPath);
    const conditionalFolderPath = path.join(outputDir, 'conditionalFolder');
    const exists = await access(conditionalFolderPath).then(() => true).catch(() => false);
    expect(exists).toBe(false);
  });
  it('should not generate the conditionalFile if the singleFile parameter is set true', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production', singleFile: 'true' }
    });
    await generator.generateFromFile(dummySpecPath);
    const conditionalFilePath = path.join(outputDir, 'conditionalFile.txt');
    const exists = await readFile(conditionalFilePath).then(() => true).catch(() => false);
    expect(exists).toBe(false);
  });

  it('should generate the conditionalFile if the singleFile parameter is set false', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production', singleFile: 'false' }
    });
    await generator.generateFromFile(dummySpecPath);
    const conditionalFilePath = path.join(outputDir, 'conditionalFile.txt');
    const exists = await readFile(conditionalFilePath).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });

  it('should generate the conditionalFile if the singleFile parameter is set false using enum validation', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator(reactTemplate, outputDir, {
      forceWrite: true ,
      templateParams: { version: 'v1', mode: 'production', singleFile: 'false' }
    });
    await generator.generateFromFile(dummySpecPath);
    const conditionalFilePath = path.join(outputDir, 'conditionalFolder2/input.txt');
    const exists = await readFile(conditionalFilePath).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });
});
