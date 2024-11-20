/**
 * @jest-environment node
 */

const path = require('path');
const { readFile } = require('fs').promises;
const Generator = require('../../../../../../apps/generator/lib/generator');
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-hoppscotch-echo.yml');
const testResultPath = path.resolve('tests/temp/snapshotTestResult');
const template = './';

describe('testing if generated client match snapshot', () => {
  jest.setTimeout(10000);
  const testOutputFile = 'client.js';

  it('generate simple client', async () => {
    const generator = new Generator(template, testResultPath, {
      forceWrite: true,
      templateParams: {
        server: 'echoServer'
      }
    });

    await generator.generateFromFile(asyncapi_v3_path);

    const client = await readFile(path.join(testResultPath, testOutputFile), 'utf8');
    expect(client).toMatchSnapshot();
  });
});
