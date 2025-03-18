/**
 * @jest-environment node
 */

const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const asyncapi_v3_path_postman = path.resolve(__dirname, './__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, './__fixtures__/asyncapi-hoppscotch-echo.yml');
const testResultPathPostman = path.resolve(__dirname, './temp/snapshotTestResultPostman');
const testResultPathHoppscotch = path.resolve(__dirname, './temp/snapshotTestResultHoppscotch');
const template = './';

describe('testing if generated client match snapshot', () => {
  jest.setTimeout(100000);
  
  // FOR POSTMAN CLIENT
  it('generate simple client for postman echo', async () => {
    const testOutputFile = 'client-postman.js';

    const generator = new Generator(template, testResultPathPostman, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFile
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_postman);

    const client = await readFile(path.join(testResultPathPostman, testOutputFile), 'utf8');
    expect(client).toMatchSnapshot();
  });


  // FOR HOPPSCOTCH CLIENT
  it('generate simple client for hoppscotch echo', async () => {
    const testOutputFile = 'client-hoppscotch.js';

    const generator = new Generator(template, testResultPathHoppscotch, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFile
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    const client = await readFile(path.join(testResultPathHoppscotch, testOutputFile), 'utf8');
    expect(client).toMatchSnapshot();
  });
});
