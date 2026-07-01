import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Example } from '../../../src/index';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of Example composer', () => {
  let parsedAsyncAPIDocument;

  const cases = [
    { language: 'javascript', clientFileName: 'echoClient.js' },
    { language: 'python', clientFileName: 'echo_client.py' },
    { language: 'dart', clientFileName: 'echo_client.dart' },
  ];

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  cases.forEach(({ language, clientFileName }) => {
    test(`render full example for language = ${language}`, () => {
      const params = {
        appendClientSuffix: false,
        customClientName: 'EchoClient',
        clientFileName,
      };
      const result = render(
        <Example
          asyncapi={parsedAsyncAPIDocument}
          params={params}
          language={language}
        />
      );
      expect(result.trim()).toMatchSnapshot();
    });
  });

  test('throws when asyncapi is missing', () => {
    expect(() => render(
      <Example asyncapi={null} params={{ clientFileName: 'c.js' }} language="javascript" />
    )).toThrow(/AsyncAPI document is missing/);
  });

  test('throws when params is missing', () => {
    expect(() => render(
      <Example asyncapi={parsedAsyncAPIDocument} language="javascript" />
    )).toThrow(/Invalid params object/);
  });

  test('throws when language is unsupported', () => {
    expect(() => render(
      <Example
        asyncapi={parsedAsyncAPIDocument}
        params={{ clientFileName: 'c.rb' }}
        language="ruby"
      />
    )).toThrow(/Unsupported language "ruby"\. Supported languages:/);
  });
});
