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
    console.log('yooo', parsedAsyncAPIDocument);
    const info = {
      title: () => parsedAsyncAPIDocument.info.title,
      version: () => parsedAsyncAPIDocument.info.version,
    };

    const serverWithPathname = {
      protocol: () => parsedAsyncAPIDocument.servers()[3].protocol(),
      host: () => parsedAsyncAPIDocument.servers()[3].host(),
      pathname: () => parsedAsyncAPIDocument.servers()[3].pathname(),
      hasPathname: () => true
    };

    const wrapperWithPathname = FileHeaderInfo({ info, server: serverWithPathname });

    expect(wrapperWithPathname).toMatchSnapshot();

    const serverWithoutPathname = {
      protocol: () => parsedAsyncAPIDocument.servers()[1].protocol(),
      host: () => parsedAsyncAPIDocument.servers()[1].host(),
      pathname: () => '',
      hasPathname: () => false
    };

    const wrapperWithoutPathname = FileHeaderInfo({ info, server: serverWithoutPathname });

    expect(wrapperWithoutPathname).toMatchSnapshot();
  });
});
