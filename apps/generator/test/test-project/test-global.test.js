/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve(__dirname, '../docs/dummy.yml');
const strThatShouldBeMissing = '<div class="text-sm text-gray-700 mb-2">Correlation ID<span class="border text-orange-600 rounded text-xs ml-3 py-0 px-2">';
const templateName = '@asyncapi/html-template';
const tempOutputResults = '../temp/integrationTestResult';
const fileToCheck = 'index.html';
const logMessage = require('../../lib/logMessages');
const version = '0.16.0';

//we do not want to download chromium for html-template if it is not needed
process.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] = true;
console.log = jest.fn();

describe('Testing if html was generated using global template', () => {
  jest.setTimeout(1000000);

  it('generated html should not contain information about correlationId because of older html-template version that is installed globally', async () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve(tempOutputResults, Math.random().toString(36).substring(7));

    //we setup generator using template name, not path, without explicitly running installation
    //generator picks up template that is already in node_modules as it was installed before as node dependency in global packages location
    const generator = new Generator(templateName, outputDir, { forceWrite: true, debug: true, templateParams: { singleFile: true } });
    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(outputDir, fileToCheck), 'utf8');
    const isCorelationIdInHtml = file.includes(strThatShouldBeMissing);

    //we make sure that index.html file doesn't contain any information about correlationId because this feature was added in html-template 0.17.0 while this test uses template 0.16.0
    expect(isCorelationIdInHtml).toStrictEqual(false);
    //we make sure that logs indicate that global package was used
    expect(console.log).toHaveBeenCalledWith(logMessage.templateNotFound(templateName));
    expect(console.log).toHaveBeenCalledWith(logMessage.templateVersion(version));
  });
});
