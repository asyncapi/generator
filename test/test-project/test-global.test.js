/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve(__dirname, '../docs/dummy.yml');
const templateName = 'react-template';
const tempOutputResults = '../temp/integrationTestResult';
const fileToCheck = 'test-file.md';
const logMessage = require('../../lib/logMessages');
const newContentNotExpectedInTest = 'new content';
console.log = jest.fn();

describe('Testing if markdown was generated using global template', () => {
  jest.setTimeout(1000000);

  it('generated markdown should not contain information that was added to template after it was installed globally', async () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve(tempOutputResults, Math.random().toString(36).substring(7));
  
    //we setup generator using template name, not path, without explicitly running installation
    //generator picks up template that is already in node_modules as it was installed before as node dependency in global packages location
    const generator = new Generator(templateName, outputDir, { forceWrite: true, debug: true, templateParams: { version: 'v1', mode: 'production' } });
    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(outputDir, fileToCheck), 'utf8');
    const isNewContentThere = file.includes(newContentNotExpectedInTest);

    //global template was not modified so it should not contain new content after template modification 
    expect(isNewContentThere).toStrictEqual(false);
    //we make sure that logs indicate that global package was used
    expect(console.log).toHaveBeenCalledWith(logMessage.templateNotFound(templateName));
    expect(console.log).toHaveBeenCalledWith(logMessage.templateVersion('0.0.1'));
  });
});
