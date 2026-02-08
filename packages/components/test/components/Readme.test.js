import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { buildParams } from '@asyncapi/generator-helpers';
import { Readme } from '../../src/components/readme/Readme';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../__fixtures__/asyncapi-v3.yml');

describe('Testing of Readme component', () => {
  let parsedAsyncAPIDocument;
  let params;

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
      const params = buildParams(
        language,
        { clientFileName },
        'production'
      );
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

  test.each([
    ['asyncapi is missing',    { params, language: 'javascript' }],
    ['params are missing',     { asyncapi: parsedAsyncAPIDocument, language: 'javascript' }],
    ['language is missing',    { asyncapi: parsedAsyncAPIDocument, params }],
    ['asyncapi is null',       { asyncapi: null, params, language: 'javascript' }],
    ['params is null',         { asyncapi: parsedAsyncAPIDocument, params: null, language: 'javascript' }],
    ['language is null',       { asyncapi: parsedAsyncAPIDocument, params, language: null }],
    ['language is empty',      { asyncapi: parsedAsyncAPIDocument, params, language: '' }],
    ['language is unsupported',{ asyncapi: parsedAsyncAPIDocument, params, language: 'dart' }],
  ])('throws TypeError when %s', (_label, props) => {
    expect(() => render(<Readme {...props} />)).toThrow(TypeError);
  });
});