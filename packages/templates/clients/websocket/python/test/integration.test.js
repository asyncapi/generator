/**
 * @jest-environment node
 */

const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const asyncapi_v3_path_postman = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-hoppscotch-client.yml');
const testResultPath = path.resolve(__dirname, './temp/snapshotTestResult');
const testResultPathPostman = path.join(testResultPath, 'client_postman');
const testResultPathHoppscotch = path.join(testResultPath, 'client_hoppscotch');
const testResultPathCustomHoppscotch = path.join(testResultPath, 'custom_client_hoppscotch');
const template = path.resolve(__dirname, '../');

const testOutputFiles = ['client.py', 'requirements.txt'];

describe('testing if generated client match snapshot', () => {
  jest.setTimeout(100000);
  
  it('generate simple client for postman echo', async () => {
    const generator = new Generator(template, testResultPathPostman, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFiles[0],
        appendClientSuffix: false
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_postman);

    for (const testOutputFile of testOutputFiles) {
      const filePath = path.join(testResultPathPostman, testOutputFile);
      const content = await readFile(filePath, 'utf8');

      expect(content).toMatchSnapshot(testOutputFile);
    }
  });

  it('generate simple client for hoppscotch echo', async () => {
    const generator = new Generator(template, testResultPathHoppscotch, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFiles[0],
        appendClientSuffix: false
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    for (const testOutputFile of testOutputFiles) {
      const filePath = path.join(testResultPathHoppscotch, testOutputFile);
      const content = await readFile(filePath, 'utf8');

      expect(content).toMatchSnapshot(testOutputFile);
    }
  });

  it('generate simple client for hoppscotch echo with custom client name', async () => {
    const generator = new Generator(template, testResultPathCustomHoppscotch, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFiles[0],
        appendClientSuffix: false,
        customClientName: 'HoppscotchClient'
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    for (const testOutputFile of testOutputFiles) {
      const filePath = path.join(testResultPathCustomHoppscotch, testOutputFile);
      const content = await readFile(filePath, 'utf8');
      expect(content).toMatchSnapshot(testOutputFile);
    }
  });
});
