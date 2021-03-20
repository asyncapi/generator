/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const xfs = require('fs-extra');
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve(__dirname, '../docs/dummy.yml');
const strThatShouldBeMissing = '<div class="text-sm text-gray-700 mb-2">Correlation ID<span class="border text-orange-600 rounded text-xs ml-3 py-0 px-2">';
const templateName = '@asyncapi/html-template';
const tempOutputResults = '../temp/integrationTestResult';
const fileToCheck = 'index.html';

const logMessage = require('../../lib/logMessages.js');

//we do not want to download chromium for html-template if it is not needed
process.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] = true;
console.log = jest.fn();

describe('Testing if html was generated with proper version of the template', () => {
  jest.setTimeout(200000);

  it('generated html should not contain information about correlationId because of older html-template version that is already installed', async () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve(tempOutputResults, Math.random().toString(36).substring(7));

    //we setup generator using template name, not path, without explicitly running installation
    //generator picks up template that is already in node_modules as it was installed before as node dependency
    const generator = new Generator(templateName, outputDir, { forceWrite: true, debug: true, templateParams: { singleFile: true } });
    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(outputDir, fileToCheck), 'utf8');
    const isCorelationIdInHtml = file.includes(strThatShouldBeMissing);

    //we make sure that index.html file doesn't contain any infromation about correlationId because this feature was added in html-template 0.17.0 while this test uses template 0.16.0
    expect(isCorelationIdInHtml).toStrictEqual(false);
    //we make sure that logs do not indicate that new installation is started
    expect(console.log).not.toHaveBeenCalledWith(logMessage.template_Install_Started_Msg);
    expect(console.log).toHaveBeenCalledWith(`Template sources taken from ${path.join(__dirname, 'node_modules', templateName)}.`);
    expect(console.log).toHaveBeenCalledWith('Version of the template is 0.16.0.');
  });

  it('generated html should contain information about correlationId because of explicit fresh installation of different template version (install: true)', async () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve(tempOutputResults, Math.random().toString(36).substring(7));
    const templateVersion = '0.17.0';

    const generator = new Generator(`${templateName}@${templateVersion}`, outputDir, { forceWrite: true, install: true, debug: true, templateParams: { singleFile: true } });
    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(outputDir, fileToCheck), 'utf8');
    const isCorelationIdInHtml = file.includes(strThatShouldBeMissing);

    //we make sure that index.html file doesn't contain any infromation about correlationId because this feature was added in html-template 0.17.0 while this test uses template 0.16.0
    expect(isCorelationIdInHtml).toStrictEqual(true);
    expect(console.log).toHaveBeenCalledWith(logMessage.template_Install_Started_Msg);
    expect(console.log).toHaveBeenCalledWith(logMessage.tempVersion(templateVersion));
  });

  it('generated html should not contain information about correlationId because local version of the template is old and does not have this feature (with and without install:true)', async () => {
    let file;
    let isCorelationIdInHtml;

    //we need arborist to perform installation of local template 
    const Arborist = require('@npmcli/arborist');

    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve(tempOutputResults, Math.random().toString(36).substring(7));
    const localHtmlTemplate = path.resolve(tempOutputResults, templateName);
    const templateVersion = '0.16.0';

    //we copy already installed html template out from the node_modules to simulate a local template that is stored in different location than the project
    await xfs.copy(path.resolve('node_modules', templateName), localHtmlTemplate);

    //we need to install local template before we can use it
    const arb = new Arborist({
      path: localHtmlTemplate
    });

    await arb.reify({
      save: false
    });

    //run generation by passing path to local template without passing install flag, sources should be taken from local path
    const generatorWithoutInstallFlag = new Generator(localHtmlTemplate, outputDir, { forceWrite: true, debug: true, templateParams: { singleFile: true } });
    await generatorWithoutInstallFlag.generateFromFile(dummySpecPath);

    file = await readFile(path.join(outputDir, fileToCheck), 'utf8');
    isCorelationIdInHtml = file.includes(strThatShouldBeMissing);

    //we make sure that index.html file doesn't contain any infromation about correlationId because this feature was added in html-template 0.17.0 while this test uses template 0.16.0
    expect(isCorelationIdInHtml).toStrictEqual(false);
    expect(console.log).toHaveBeenCalledWith(logMessage.templateSource(localHtmlTemplate));
    expect(console.log).toHaveBeenCalledWith(logMessage.tempVersion(templateVersion));
    expect(console.log).toHaveBeenCalledWith(logMessage.node_modules_Install);

    //run generation by passing path to local template and passing install flag, sources should be taken from local path and simlink created
    const generatorWithInstallFlag = new Generator(localHtmlTemplate, outputDir, { install: true, forceWrite: true, debug: true, templateParams: { singleFile: true } });
    await generatorWithInstallFlag.generateFromFile(dummySpecPath);

    file = await readFile(path.join(outputDir, fileToCheck), 'utf8');
    isCorelationIdInHtml = file.includes(strThatShouldBeMissing);

    //we make sure that index.html file doesn't contain any infromation about correlationId because this feature was added in html-template 0.17.0 while this test uses template 0.16.0
    expect(isCorelationIdInHtml).toStrictEqual(false);
    expect(console.log).toHaveBeenCalledWith(logMessage.template_Install_Started_Msg);
    expect(console.log).toHaveBeenCalledWith(logMessage.tempVersion(templateVersion));
    expect(console.log).toHaveBeenCalledWith(logMessage.npm_Install_Trigger);
  });
});