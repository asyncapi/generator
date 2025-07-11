import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { FileHeaderInfo } from '@asyncapi/generator-components';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of FileHeaderInfo function', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render websockets file header info with pathname correctly', () => {
    const result = render(
      <FileHeaderInfo
        info={parsedAsyncAPIDocument.info()}
        server={parsedAsyncAPIDocument.servers().get('withPathname')}
        language="javascript"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render websockets file header info without pathname correctly', () => {
    const result = render(
      <FileHeaderInfo
        info={parsedAsyncAPIDocument.info()}
        server={parsedAsyncAPIDocument.servers().get('withoutPathName')}
        language="javascript"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  test('render websockets file header info with pathname correctly (Python)', () => {
    const result = render(
      <FileHeaderInfo
        info={parsedAsyncAPIDocument.info()}
        server={parsedAsyncAPIDocument.servers().get('withPathname')}
        language="python"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render websockets file header info without pathname correctly (Python)', () => {
    const result = render(
      <FileHeaderInfo
        info={parsedAsyncAPIDocument.info()}
        server={parsedAsyncAPIDocument.servers().get('withoutPathName')}
        language="python"
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
