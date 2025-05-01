/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve(__dirname, '../docs/dummy.yml');
const templateLocation = path.resolve(__dirname,'../test-templates/react-template');
const templateName = 'react-template';
const tempOutputResults = path.resolve(__dirname, 'output');
const fileToCheck = 'test-file.md';
const source = path.join(__dirname, 'node_modules', templateName);
const logMessage = require('../../lib/logMessages.js');
const newContentNotExpectedInTest = 'new content';
const version = '0.0.1';

const originalConsoleLog = console.log;

// Replace console.log with a custom mock function
console.log = jest.fn((...args) => {
  // Call the original function to actually log to the console
  originalConsoleLog(...args);
});
describe('Testing if markdown was generated with proper version of the template', () => {
  jest.setTimeout(1000000);
  it('Test A - generated markdown should not contain new content in modified template', async () => {
    //we setup generator using template name, not path, without explicitly running installation
    //generator picks up template that is already in node_modules as it was installed before as node dependency
    //it was installed before triggering test in test.sh
    const generator = new Generator(templateName, tempOutputResults, { forceWrite: true, debug: true, templateParams: { version: 'v1', mode: 'production' } });
    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(tempOutputResults, fileToCheck), 'utf8');
    const isNewContentThere = file.includes(newContentNotExpectedInTest);

    //we make sure that markdown file doesn't contain new content as old version of template do not have it
    expect(isNewContentThere).toStrictEqual(false);
    //we make sure that logs do not indicate that new installation is started
    expect(console.log).not.toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_FLAG_MSG));
    expect(console.log).toHaveBeenCalledWith(logMessage.templateSource(source));
    expect(console.log).toHaveBeenCalledWith(logMessage.templateVersion(version));
  });

  it('Test B - generated markdown should contain new content because of explicit fresh installation of different template version (install: true)', async () => {
    const templateVersion = '0.0.2';

    const generator = new Generator(`${templateName}@${templateVersion}`, tempOutputResults, { compile: true, forceWrite: true, install: true, debug: true, templateParams: { version: 'v1', mode: 'production' } });
    await generator.generateFromFile(dummySpecPath);
    
    const file = await readFile(path.join(tempOutputResults, fileToCheck), 'utf8');
    const isNewContentThere = file.includes(newContentNotExpectedInTest);

    //in 0.0.2 version of template there is a new content as in test.sh we made sure new template version has new content not present in 0.0.1
    expect(isNewContentThere).toStrictEqual(true);
    expect(console.log).toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_FLAG_MSG));
    expect(console.log).toHaveBeenCalledWith(logMessage.templateVersion(templateVersion));
  });

  it('Test C - generated markdown should not contain new content of template because local version of the template is old and does not have new content (with and without install:true)', async () => {
    let file;
    let isNewContentThere;

    //we need arborist to perform installation of local template 
    const Arborist = require('@npmcli/arborist');

    //we need to install local template before we can use it
    const arb = new Arborist({
      path: templateLocation
    });

    await arb.reify({
      save: false
    });

    //run generation by passing path to local template without passing install flag, sources should be taken from local path
    const generatorWithoutInstallFlag = new Generator(templateLocation, tempOutputResults, { forceWrite: true, debug: true, templateParams: { version: 'v1', mode: 'production' } });
    await generatorWithoutInstallFlag.generateFromFile(dummySpecPath);

    file = await readFile(path.join(tempOutputResults, fileToCheck), 'utf8');
    isNewContentThere = file.includes(newContentNotExpectedInTest);

    //we make sure that markdown file doesn't contain new content as old version of template do not have it
    expect(isNewContentThere).toStrictEqual(false);
    expect(console.log).toHaveBeenCalledWith(logMessage.templateSource(templateLocation));
    expect(console.log).toHaveBeenCalledWith(logMessage.templateVersion(version));
    expect(console.log).toHaveBeenCalledWith(logMessage.NODE_MODULES_INSTALL);

    //run generation by passing path to local template and passing install flag, sources should be taken from local path and simlink created
    const generatorWithInstallFlag = new Generator(templateLocation, tempOutputResults, { install: true, forceWrite: true, debug: true, templateParams: { version: 'v1', mode: 'production' } });
    await generatorWithInstallFlag.generateFromFile(dummySpecPath);

    file = await readFile(path.join(tempOutputResults, fileToCheck), 'utf8');
    isNewContentThere = file.includes(newContentNotExpectedInTest);

    //we make sure that markdown file doesn't contain new content as old version of template do not have it
    expect(isNewContentThere).toStrictEqual(false);
    expect(console.log).toHaveBeenCalledWith(logMessage.installationDebugMessage(logMessage.TEMPLATE_INSTALL_FLAG_MSG));
    expect(console.log).toHaveBeenCalledWith(logMessage.templateVersion(version));
    expect(console.log).toHaveBeenCalledWith(logMessage.NPM_INSTALL_TRIGGER);
  });
});
