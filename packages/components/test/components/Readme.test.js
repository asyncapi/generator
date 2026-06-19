import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Readme } from '../../src/components/readme/Readme';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');

describe('Testing of Readme component', () => {
  let parsedAsyncAPIDocument;

  const languageConfigs = [
    { language: 'javascript', clientFileName: 'myClient.js' },
    { language: 'python', clientFileName: 'myClient.py' },
  ];

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  languageConfigs.forEach(({ language, clientFileName }) => {
    test(`render Readme with language = ${language}`, () => {
      const params = {
        server: 'production',
        appendClientSuffix: true,
        customClientName: 'AccountServiceClient',
        clientFileName
      };
      const result = render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          params={params}
          language={language}
        />
      );

      const actual = result.trim();
      expect(actual).toMatchSnapshot();
    });
  });

  test('throws error when asyncapi is missing', () => {
    expect(() =>
      render(
        <Readme
          asyncapi={null}
          params={{}}
          language="javascript"
        />
      )
    ).toThrow(/AsyncAPI document is missing./);
  });

  test('throws error when params is missing', () => {
    expect(() =>
      render(
        <Readme
          asyncapi={parsedAsyncAPIDocument}
          language="javascript"
        />
      )
    ).toThrow(/Invalid params object. Received:/);
  });
});