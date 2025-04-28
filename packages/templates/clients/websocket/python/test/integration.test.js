/**
 * @jest-environment node
 */

const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const { listFiles } = require('@asyncapi/generator-helpers');
const asyncapi_v3_path_postman = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-hoppscotch-client.yml');
const asyncapi_v3_path_slack = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-slack-client.yml');
const testResultPath = path.resolve(__dirname, './temp/snapshotTestResult');
const testResultPathPostman = path.join(testResultPath, 'client_postman');
const testResultPathHoppscotch = path.join(testResultPath, 'client_hoppscotch');
const testResultPathCustomHoppscotch = path.join(testResultPath, 'custom_client_hoppscotch');
const testResultPathSlack = path.join(testResultPath, 'client_slack');
const template = path.resolve(__dirname, '../');
const clientFileName = 'client.py';

describe('testing if generated client match snapshot', () => {
  jest.setTimeout(100000);
  
  it('generate simple client for postman echo', async () => {
    const generator = new Generator(template, testResultPathPostman, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName,
        appendClientSuffix: true
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_postman);

    const testOutputFiles = await listFiles(testResultPathPostman);

    for (const testOutputFile of testOutputFiles) {
      const content = await readFile(path.normalize(testOutputFile, 'utf8'));
      expect(content).toMatchSnapshot(testOutputFile);
    }
  });

  it('generate simple client for hoppscotch echo', async () => {
    const generator = new Generator(template, testResultPathHoppscotch, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    const testOutputFiles = await listFiles(testResultPathHoppscotch);

    for (const testOutputFile of testOutputFiles) {
      const content = await readFile(path.normalize(testOutputFile, 'utf8'));
      expect(content).toMatchSnapshot(testOutputFile);
    }
  });

  it('generate simple client for hoppscotch echo with custom client name', async () => {
    const generator = new Generator(template, testResultPathCustomHoppscotch, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName,
        customClientName: 'HoppscotchClient'
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    const testOutputFiles = await listFiles(testResultPathCustomHoppscotch);

    for (const testOutputFile of testOutputFiles) {
      const content = await readFile(path.normalize(testOutputFile, 'utf8'));
      expect(content).toMatchSnapshot(testOutputFile);
    }
  });

  it('generate client for slack', async () => {
    const generator = new Generator(template, testResultPathSlack, {
      forceWrite: true,
      templateParams: {
        server: 'production',
        clientFileName
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_slack);

    const testOutputFiles = await listFiles(testResultPathSlack);
    
    for (const testOutputFile of testOutputFiles) {
      console.log(testOutputFile);
      const content = await readFile(path.normalize(testOutputFile, 'utf8'));
      expect(content).toMatchSnapshot(testOutputFile);
    }
  });
});
