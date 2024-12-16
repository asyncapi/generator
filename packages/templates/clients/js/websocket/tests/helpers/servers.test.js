import path from 'path';
import { Parser, fromFile } from '@asyncapi/parser';
import { getServerUrl } from '../../helpers/servers';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../__fixtures__/asyncapi-websocket-query.yml');

describe('getServerUrl integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should generate correct server URL when protocol is missing from the host', () => {
    const server = parsedAsyncAPIDocument.servers().get('withoutPathName');

    const serverUrl = getServerUrl(server);

    // Example assertion: Ensure protocol is added correctly
    expect(serverUrl).toBe('wss://api.gemini.com');
  });

  it('should not add protocol if it is already included in the host field', () => {
    const server = parsedAsyncAPIDocument.servers().get('withHostDuplicatingProtocol');

    const serverUrl = getServerUrl(server);

    // Example assertion: Ensure no protocol is added if already present
    expect(serverUrl).toBe('wss://api.gemini.com');
  });

  it('should correctly append pathname to server URL', () => {
    const server = parsedAsyncAPIDocument.servers().get('withPathname');

    const serverUrl = getServerUrl(server);

    // Example assertion: Ensure the pathname is appended to the URL
    expect(serverUrl).toBe('wss://api.gemini.com/v1/marketdata');
  });
});
