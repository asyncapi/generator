import path from 'path';
import { transformSync } from '@babel/core';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getServer, getServerUrl } from '@asyncapi/generator-helpers';
import { Constructor } from '../../components/Constructor.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('Constructor component (integration with AsyncAPI document)', () => {
  let servers;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    servers = parseResult.document.servers();
  });

  test('escapes quote characters in the server URL', () => {
    const server = getServer(servers, 'withQuotedVariables');
    const serverUrl = getServerUrl(server);
    const result = render(<Constructor serverUrl={serverUrl} sendOperations={[]} />);

    expect(result).toContain('this.url = url || "wss://test.example.com/ws/btc\\"usd";');
    expect(() => transformSync(`class Client {\n${result}\n}`, {
      configFile: false,
      babelrc: false
    })).not.toThrow();
  });
});
