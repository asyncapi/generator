const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getServerUrl, getServer, getServerHost, getServerProtocol } = require('@asyncapi/generator-helpers');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');
const GEMINI_HOST = 'api.gemini.com';

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

  it('should replace server variables in the URL with their default values', () => {
    const server = parsedAsyncAPIDocument.servers().get('withVariables');

    const serverUrl = getServerUrl(server);

    expect(serverUrl).toBe('wss://api.gemini.com/v1/marketdata/btcusd');
  });

  it('should replace a server variable in the host with its default value', () => {
    const server = parsedAsyncAPIDocument.servers().get('withHostVariable');

    const serverUrl = getServerUrl(server);

    expect(serverUrl).toBe('wss://us-east.api.gemini.com/v1/marketdata');
  });

  it('should replace variables in both the host and pathname', () => {
    const server = parsedAsyncAPIDocument.servers().get('withMultipleVariables');

    const serverUrl = getServerUrl(server);

    expect(serverUrl).toBe('wss://us-east.api.gemini.com/v1/marketdata/btcusd');
  });

  it('should not cascade substitutions through a default containing a placeholder', () => {
    const server = parsedAsyncAPIDocument.servers().get('withNestedDefault');

    const serverUrl = getServerUrl(server);

    expect(serverUrl).toBe('wss://api.gemini.com/v1/marketdata/{second}');
  });

  it('should preserve quote characters from a server variable default', () => {
    const server = parsedAsyncAPIDocument.servers().get('withQuotedDefault');

    const serverUrl = getServerUrl(server);

    expect(serverUrl).toBe('wss://api.gemini.com/v1/marketdata/btc"usd');
  });

  it('should keep the placeholder when a server variable has no default value', () => {
    const server = parsedAsyncAPIDocument.servers().get('withVariableWithoutDefault');

    const serverUrl = getServerUrl(server);

    expect(serverUrl).toBe('wss://api.gemini.com/v1/marketdata/{symbol}');
  });

  it('should keep the placeholder when a server variable default is null', () => {
    // Why: the Parser rejects a `null` default because the spec requires a
    // string, so a hand-built stand-in is the only way to cover this branch.
    const mockServer = {
      host: () => GEMINI_HOST,
      protocol: () => 'wss',
      hasPathname: () => true,
      pathname: () => '/v1/marketdata/{symbol}',
      variables: () => ({
        entries: () => [
          [0, { id: () => 'symbol', defaultValue: () => null }]
        ]
      })
    };

    expect(getServerUrl(mockServer)).toBe('wss://api.gemini.com/v1/marketdata/{symbol}');
  });
});

describe('getServer integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

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

describe('getServerHost integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should return correct server host when host is provided', () => {
    const server = parsedAsyncAPIDocument.servers().get('withPathname');
    
    const serverHost = getServerHost(server);
    const expectedHost = server.host();

    expect(serverHost).toBe(expectedHost);
  });

  it('should replace a server variable in the host with its default value', () => {
    const server = parsedAsyncAPIDocument.servers().get('withHostVariable');

    const serverHost = getServerHost(server);

    expect(serverHost).toBe('us-east.api.gemini.com');
  });

  it('should handle server with duplicate protocol in host', () => {
    const server = parsedAsyncAPIDocument.servers().get('withHostDuplicatingProtocol');    
    const serverHost = getServerHost(server);

    // Should strip the duplicate protocol prefix
    expect(serverHost).toBe(GEMINI_HOST);
  });

  it('should throw error when server has no host', () => {
    // Mock a server without host
    const mockServer = {
      host: () => null,
      protocol: () => 'wss'
    };
    
    expect(() => getServerHost(mockServer)).toThrow('Host not found in the server configuration.');
  });

  it('should throw error when server has empty host', () => {
    // Mock a server without host
    const mockServer = {
      host: () => '',
      protocol: () => 'wss'
    };
  
    expect(() => getServerHost(mockServer)).toThrow('Host not found in the server configuration.');
  });
});

describe('getServerProtocol integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should return correct server protocol when protocol is provided', () => {
    const server = parsedAsyncAPIDocument.servers().get('withPathname');
    
    const serverProtocol = getServerProtocol(server);
    const expectedProtocol = server.protocol();

    expect(serverProtocol).toBe(expectedProtocol);
  });

  it('should handle different protocol types', () => {
    const server = parsedAsyncAPIDocument.servers().get('withHostDuplicatingProtocol');    
    const serverProtocol = getServerProtocol(server);
    const expectedProtocol = server.protocol();

    expect(serverProtocol).toBe(expectedProtocol);
  });

  it('should throw error when server has no protocol', () => {
    const mockServer = {
      host: () => GEMINI_HOST,
      protocol: () => null
    };
    
    expect(() => getServerProtocol(mockServer)).toThrow('Protocol is not defined in server configuration.');
  });

  it('should throw error when server has empty protocol', () => {
    const mockServer = {
      host: () => GEMINI_HOST,
      protocol: () => ''
    };
  
    expect(() => getServerProtocol(mockServer)).toThrow('Protocol is not defined in server configuration.');
  });

  it('should return valid protocols like ws, wss, http, https, etc.', () => {
    const protocols = ['ws', 'wss', 'http', 'https', 'mqtt', 'amqp'];
    
    protocols.forEach(protocolValue => {
      const mockServer = {
        host: () => GEMINI_HOST,
        protocol: () => protocolValue
      };
      
      const result = getServerProtocol(mockServer);
      expect(result).toBe(protocolValue);
    });
  });
});