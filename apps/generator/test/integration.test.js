/**
 * @jest-environment node
 */

const path = require('path');
const { readFile, writeFile, access, unlink, mkdir } = require('fs').promises;
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
    const outputDir = generateFolderName();
  
    // Create temp.md.js file dynamically
    const tempJsPath = path.join(reactTemplate, 'template/temp.md.js');
    await writeFile(tempJsPath, tempJsContent);

    const generator = new Generator(reactTemplate, outputDir, {
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
    
    // first we need to do cleanup of the react template `__transpiled` folder as from previous test it will have the transpiled files
    const transpiledPath = path.join(reactTemplate, '__transpiled');
    await unlink(path.join(transpiledPath, 'temp.md.js'));
    await unlink(path.join(transpiledPath, 'temp.md.js.map'));

    // Create temp.md.js file dynamically
    const tempJsPath = path.join(reactTemplate, 'template/temp.md.js');
    await writeFile(tempJsPath, tempJsContent);
  
    const generator = new Generator(reactTemplate, outputDir, {
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
    // Manually create a file to test if it's not overwritten
    await mkdir(outputDir, { recursive: true });
    // Create a variable to store the file content
    const testContent = '<script>const initialContent = "This should not change";</script>';
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const testFilePath = path.normalize(path.resolve(outputDir, testOutputFile));
    await writeFile(testFilePath, testContent);

    // Manually create an output first, before generation, with additional custom file to validate if later it is still there, not overwritten
    const generator = new Generator(reactTemplate, outputDir, {
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
});
