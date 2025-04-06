/**
 * @jest-environment node
 */

const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');

const asyncapi_v3_path_postman = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-hoppscotch-echo.yml');
const testResultPath = path.resolve(__dirname, './temp/snapshotTestResult');
const template = path.resolve(__dirname, '../');

describe('Python WebSocket client generation', () => {
  jest.setTimeout(100000);

  it('generates client for Postman Echo WebSocket', async () => {
    const testOutputFiles = ['client_postman.py', 'requirements.txt'];

    const generator = new Generator(template, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFiles[0],
      },
    });

    await generator.generateFromFile(asyncapi_v3_path_postman);

    for (const file of testOutputFiles) {
      const content = await readFile(path.join(testResultPath, file), 'utf8');
      expect(content).toMatchSnapshot(file);
    }
  });

  it('generates client for Hoppscotch Echo WebSocket', async () => {
    const testOutputFiles = ['client_hoppscotch.py', 'requirements.txt'];

    const generator = new Generator(template, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFiles[0],
      },
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    for (const file of testOutputFiles) {
      const content = await readFile(path.join(testResultPath, file), 'utf8');
      expect(content).toMatchSnapshot(file);
    }
  });
});
