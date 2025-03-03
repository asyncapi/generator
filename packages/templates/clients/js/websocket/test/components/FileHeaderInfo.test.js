import path from 'path';
import { Parser, fromFile } from '@asyncapi/parser';
import { FileHeaderInfo } from '../../components/FileHeaderInfo';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of FileHeaderInfo function', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render websockets file header info correctly', () => {
    const wrapperWithPathname = FileHeaderInfo({ info: parsedAsyncAPIDocument.info(), server: parsedAsyncAPIDocument.servers().get('withPathname') });

    expect(wrapperWithPathname).toMatchSnapshot();

    const wrapperWithoutPathname = FileHeaderInfo({ info: parsedAsyncAPIDocument.info(), server: parsedAsyncAPIDocument.servers().get('withoutPathName') });

    expect(wrapperWithoutPathname).toMatchSnapshot();
  });
});
