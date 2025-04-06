/**
 * @jest-environment node
 */

const path = require('path');
const { readFile, stat } = require('fs').promises;
const Generator = require('@asyncapi/generator');

// ✅ Corrected paths to centralized __fixtures__
const asyncapiPostmanPath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-postman-echo.yml');
const asyncapiHoppscotchPath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-hoppscotch-echo.yml');

const testResultPath = path.resolve(__dirname, './temp/snapshotTestResult');
const templatePath = path.resolve(__dirname, '../');

describe('JavaScript WebSocket client generation', () => {
  jest.setTimeout(100000);

  it('generates client for Postman Echo WebSocket', async () => {
    const outputFile = 'client-postman.js';
    const generator = new Generator(templatePath, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: outputFile,
      },
    });

    await generator.generateFromFile(asyncapiPostmanPath);
    const client = await readFile(path.join(testResultPath, outputFile), 'utf8');
    expect(client).toMatchSnapshot();
  });

  it('generates client for Hoppscotch Echo WebSocket', async () => {
    const outputFile = 'client-hoppscotch.js';
    const generator = new Generator(templatePath, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: outputFile,
      },
    });

    await generator.generateFromFile(asyncapiHoppscotchPath);
    const client = await readFile(path.join(testResultPath, outputFile), 'utf8');
    expect(client).toMatchSnapshot();
  });

  it('generates default client filename when clientFileName is not provided', async () => {
    const defaultOutputFile = 'client.js';
    const generator = new Generator(templatePath, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
      },
    });

    await generator.generateFromFile(asyncapiHoppscotchPath);
    const checkExists = await stat(path.join(testResultPath, defaultOutputFile));
    expect(checkExists.isFile()).toBeTruthy();
  });

  it('throws error when required "server" param is missing', async () => {
    const outputFile = 'client-hoppscotch.js';
    const generator = new Generator(templatePath, testResultPath, {
      forceWrite: true,
      templateParams: {
        clientFileName: outputFile,
      },
    });

    await expect(generator.generateFromFile(asyncapiHoppscotchPath))
      .rejects
      .toThrow('This template requires the following missing params: server');
  });
});
