/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const templateName = '@asyncapi/html-template';
const tempOutputResults = '../temp/integrationTestResult';

console.log = jest.fn();

describe('Testing if html template can fetch from private repository', () => {
  jest.setTimeout(200000);

  let ArboristMock;
  let arboristMock;

  beforeEach(() => {
    ArboristMock = require('@npmcli/arborist');
    arboristMock = new ArboristMock();
  });

  it('fetching the html template from the private repository', async () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    const outputDir = path.resolve(tempOutputResults, Math.random().toString(36).substring(7));
    //we setup the generator to pick the template file that is present in the private repository
    const generator = new Generator(templateName, outputDir, { forceWrite: true, debug: true, templateParams: { singleFile: true }, registry: {url: 'http://localhost:4873/', username: 'admin', password: 'nimda'}});
    
    await generator.installTemplate();

    expect(arboristMock.reify).toHaveBeenCalledTimes(1);
  });
});
