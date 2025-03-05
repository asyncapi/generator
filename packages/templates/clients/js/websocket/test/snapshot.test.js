/**
 * @jest-environment node
 */

const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const asyncapi_v3_path_postman = path.resolve(__dirname, './__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, './__fixtures__/asyncapi-hoppscotch-echo.yml');
const testResultPath = path.resolve(__dirname, './temp/snapshotTestResult');
const template = path.resolve(__dirname, '../');

describe('testing if generated client match snapshot', () => {
  jest.setTimeout(100000);
  
  it('generate simple client for postman echo', async () => {
    const testOutputFile = 'client-postman.js';

    const generator = new Generator(template, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFile
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_postman);

    const client = await readFile(path.join(testResultPath, testOutputFile), 'utf8');
    expect(client).toMatchSnapshot();
  });

  it('generate simple client for hoppscotch echo', async () => {
    const testOutputFile = 'client-hoppscotch.js';

    const generator = new Generator(template, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFile
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    const client = await readFile(path.join(testResultPath, testOutputFile), 'utf8');
    expect(client).toMatchSnapshot();
  });
});
