import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { FileHeaderInfo } from '../../src/index';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of FileHeaderInfo function', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  const languages = ['Dart', 'Python', 'Javascript'];
  it.each(languages)('render websockets file header info with pathname correctly (%s)', (language) => {
    const result = render(
      <FileHeaderInfo
        info={parsedAsyncAPIDocument.info()}
        server={parsedAsyncAPIDocument.servers().get('withPathname')}
        language={language.toLowerCase()}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  it.each(languages)('render websockets file header info without pathname correctly (%s)', (language) => {
    const result = render(
      <FileHeaderInfo
        info={parsedAsyncAPIDocument.info()}
        server={parsedAsyncAPIDocument.servers().get('withoutPathName')}
        language={language.toLowerCase()}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws an error when info object is not provided', () => {
    expect(() => {
      render(
        <FileHeaderInfo
          server={parsedAsyncAPIDocument.servers().get('withPathname')}
          language='javascript'
        />
      );
    }).toThrow(/AsyncAPI "info" object is missing./);
  });

  test('throws an error when server object is not provided', () => {
    expect(() => {
      render(
        <FileHeaderInfo
          info={parsedAsyncAPIDocument.info()}
          language='javascript'
        />
      );
    }).toThrow(/AsyncAPI "server" object is missing./);
  });

  test('throws an error when unsupported language is provided', () => {
    expect(() => {
      render(
        <FileHeaderInfo
          info={parsedAsyncAPIDocument.info()}
          server={parsedAsyncAPIDocument.servers().get('withPathname')}
          language='cpp'
        />
      );
    }).toThrow(/Unsupported language "cpp". Supported languages:/);
  });

  test('throws an error when language is not provided', () => {
    expect(() => {
      render(
        <FileHeaderInfo
          info={parsedAsyncAPIDocument.info()}
          server={parsedAsyncAPIDocument.servers().get('withPathname')}
        />
      );
    }).toThrow(/Language is required. Supported languages:/);
  });
});