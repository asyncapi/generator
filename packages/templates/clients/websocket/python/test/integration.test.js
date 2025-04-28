/**
 * @jest-environment node
 */

const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const { listFiles } = require('@asyncapi/generator-helpers');
const asyncapi_v3_path_postman = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-hoppscotch-echo.yml');
const asyncapi_v3_path_slack = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-slack-client.yml');
const testResultPath = path.resolve(__dirname, './temp/snapshotTestResult');
const testResultPathPostman = path.join(testResultPath, 'client_postman');
const testResultPathHoppscotch = path.join(testResultPath, 'client_hoppscotch');
const testResultPathSlack = path.join(testResultPath, 'client_slack');
const template = path.resolve(__dirname, '../');

describe('testing if generated client match snapshot', () => {
  jest.setTimeout(100000);
  
  it('generate simple client for postman echo', async () => {
    const testOutputFiles = ['client.py', 'requirements.txt'];

    const generator = new Generator(template, testResultPathPostman, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFiles[0]
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
    const testOutputFiles = ['client.py', 'requirements.txt'];

    const generator = new Generator(template, testResultPathHoppscotch, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
        clientFileName: testOutputFiles[0]
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    for (const testOutputFile of testOutputFiles) {
      const filePath = path.join(testResultPathHoppscotch, testOutputFile);
      const content = await readFile(filePath, 'utf8');

      expect(content).toMatchSnapshot(testOutputFile);
    }
  });

  it('generate client for slack', async () => {
    const generator = new Generator(template, testResultPathSlack, {
      forceWrite: true,
      templateParams: {
        server: 'production',
        clientFileName: 'client.py'
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_slack);

    const testOutputFiles = await listFiles(testResultPathSlack);
    
    for (const testOutputFile of testOutputFiles) {
      const filePath = path.join(testOutputFile);
      const content = await readFile(filePath, 'utf8');

      expect(content).toMatchSnapshot(testOutputFile);
    }
  });
});
