/**
 * @jest-environment node
 */

const { readFile } = require('fs').promises;
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecPath = path.resolve(__dirname, '../docs/dummy.yml');
const crypto = require('crypto');
const mainTestResultPath = 'test/temp/integrationTestResult';
process.env['PUPPETEER_SKIP_CHROMIUM_DOWNLOAD'] = true;
console.log = jest.fn();

describe('Integration testing generateFromFile() to make sure the template can be download from the private repository from argument', () => {
  const generateFolderName = () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(1000000);

  it('generated using private registory', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator('@asyncapi/html-template', outputDir,
      {
        debug: true,
        install: true,
        forceWrite: true,
        templateParams: {
          singleFile: true
        },
        registry: {
          url: 'http://verdaccio:4873',
          auth: 'YWRtaW46bmltZGE='  // base64 encoded username and password represented as admin:nimda

        }
      });

    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(file).toContain('Dummy example with all spec features included');
    expect(console.log).toHaveBeenCalledWith('Using npm registry http://verdaccio:4873 and authorization type //verdaccio:4873:_auth to handle template installation.');
  });
});

describe('Integration testing generateFromFile() to make sure the template can be download from the private repository from npm config', () => {
  const generateFolderName = () => {
    //you always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(mainTestResultPath, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(1000000);

  it('generated using private registory from npm config', async () => {
    const outputDir = generateFolderName();
    const generator = new Generator('@asyncapi/html-template', outputDir,
      {
        debug: true,
        install: true,
        forceWrite: true,
        templateParams: {
          singleFile: true
        }
      });

    await generator.generateFromFile(dummySpecPath);

    const file = await readFile(path.join(outputDir, 'index.html'), 'utf8');
    expect(file).toContain('Dummy example with all spec features included');
  });
});
