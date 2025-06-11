/**
 * @jest-environment node
 */

const path = require('path');
const { readFile, stat } = require('fs').promises;
const Generator = require('@asyncapi/generator');
const asyncapi_v3_path_postman = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-postman-echo.yml');
const asyncapi_v3_path_hoppscotch = path.resolve(__dirname, '../../test/__fixtures__/asyncapi-hoppscotch-client.yml');
const testResultPath = path.resolve(__dirname, './temp/snapshotTestResult');
const testResultPathPostman = path.join(testResultPath, 'client_postman');
const testResultPathHoppscotch = path.join(testResultPath, 'client_hoppscotch');
const testResultPathCustomHoppscotch = path.join(testResultPath, 'custom_client_hoppscotch');
const template = path.resolve(__dirname, '../');
const { listFiles } = require('@asyncapi/generator-helpers');
const clientFileName = 'client.js';

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
        clientFileName
      }
    });
  
    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);
  
    const testOutputFiles = await listFiles(testResultPathHoppscotch);
  
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
        clientFileName,
        customClientName: 'HoppscotchClient'
      }
    });
  
    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);
  
    const testOutputFiles = await listFiles(testResultPathCustomHoppscotch);
  
    for (const testOutputFile of testOutputFiles) {
      const filePath = path.join(testResultPathCustomHoppscotch, testOutputFile);
      const content = await readFile(filePath, 'utf8');
      expect(content).toMatchSnapshot(testOutputFile);
    }
  });
  it('generate simple client for hoppscotch echo without clientFileName param', async () => {
    const defaultOutputFile = 'client.js';

    const generator = new Generator(template, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer',
      }
    });

    await generator.generateFromFile(asyncapi_v3_path_hoppscotch);

    const clientOutputFile = path.join(testResultPath, defaultOutputFile);

    const checkClientOutputFileExists = await stat(clientOutputFile);

    expect(checkClientOutputFileExists.isFile()).toBeTruthy();
  });

  it('should throw an error when server param is missing during simple client generation for hoppscotch echo', async () => {
    const testOutputFile = 'client-hoppscotch.js';

    const generator = new Generator(template, testResultPath, {
      forceWrite: true,
      templateParams: {
        clientFileName: testOutputFile
      }
    });

    await expect(generator.generateFromFile(asyncapi_v3_path_hoppscotch)).rejects.toThrow('This template requires the following missing params: server');
  });
});