/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve(__dirname, '../docs/dummy.yml');
const tempOutputResults = path.resolve(__dirname, 'output');

// Save the original console.log
const originalConsoleLog = console.log;

// Replace console.log with a custom mock function
console.log = jest.fn((...args) => {
  // Call the original function to actually log to the console
  originalConsoleLog(...args);
});
describe('Integration testing generateFromFile() to make sure the template can be download from the private repository from argument', () => {
  jest.setTimeout(1000000);

  it('generated using private registory', async () => {
    const generator = new Generator('react-template', tempOutputResults,
      {
        compile: true,
        debug: true,
        install: true,
        forceWrite: true,
        templateParams: { version: 'v1', mode: 'production' },
        registry: {
          url: 'http://verdaccio:4873',
          auth: 'YWRtaW46bmltZGE='  // base64 encoded username and password represented as admin:nimda

        }
      });

    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(tempOutputResults, 'test-file.md'), 'utf8');
    expect(file).toContain('new content');
    expect(console.log).toHaveBeenCalledWith('Using npm registry http://verdaccio:4873 and authorization type //verdaccio:4873:_auth to handle template installation.');
  });
});

describe('Integration testing generateFromFile() to make sure the template can be download from the private repository from npm config', () => {
  jest.setTimeout(5000000);
  it('generated using private registory from npm config', async () => {
    const generator = new Generator('react-template', tempOutputResults,
      {
        compile: true,
        debug: true,
        install: true,
        forceWrite: true,
        templateParams: { version: 'v1', mode: 'production' }
      });

    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(tempOutputResults, 'test-file.md'), 'utf8');
    expect(file).toContain('new content');
  });
});
