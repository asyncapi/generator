const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve(__dirname, '../docs/dummy.yml');
const strThatShouldBeMissing = '<div class="text-sm text-gray-700 mb-2">Correlation ID<span class="border text-orange-600 rounded text-xs ml-3 py-0 px-2">';

describe('Testing if html was generated with proper version of the template', () => {
  jest.setTimeout(30000);

  it('generated html should not contain information about correlationId', async () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve('../temp/integrationTestResult', Math.random().toString(36).substring(7));

    const generator = new Generator('@asyncapi/html-template', outputDir, { forceWrite: true, templateParams: { singleFile: true } });
    await generator.generateFromFile(dummySpecPath);    
    const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    const isCorelationIdInHtml = file.includes(strThatShouldBeMissing);
    expect(isCorelationIdInHtml).toStrictEqual(false);
  });
});