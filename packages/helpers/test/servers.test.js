const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getServerUrl, getServer } = require('@asyncapi/generator-helpers');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

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

describe('getServer integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;
  let servers;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should return the exact server object when server exists', () => {
    const servers = parsedAsyncAPIDocument.servers();

    const serverName = 'withoutPathName';

    const expectedServer = servers.get(serverName);

    const actualServer = getServer(servers, serverName);

    expect(actualServer).toBe(expectedServer);
  });

  it('should throw error when server does not exist in the document', () => {
    const servers = parsedAsyncAPIDocument.servers();

    const serverName = 'nonExistentServer';

    expect(() => {
      getServer(servers, serverName);
    }).toThrow(`Server "${serverName}" not found in AsyncAPI document. Available servers: ${Array.from(servers.keys()).join(', ')}`);
  });

  it('should throw error when server name is not provided', () => {
    const servers = parsedAsyncAPIDocument.servers();
    
    const serverName = '';

    expect(() => {
      getServer(servers, serverName);
    }).toThrow('Server name must be provided.');
  });
});
