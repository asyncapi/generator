import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getServer, getServerUrl, getQueryParams } from '@asyncapi/generator-helpers';
import { Constructor } from '../../components/Constructor.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Constructor component (integration with AsyncAPI document)', () => {
  let servers;
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    servers = parsedAsyncAPIDocument.servers();
  });

  test('renders with only serverUrl (withHostDuplicatingProtocol)', () => {
    const server = getServer(servers, 'withHostDuplicatingProtocol');
    const serverUrl = getServerUrl(server);
    const result = render(<Constructor serverUrl={serverUrl} query={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with neither serverUrl nor query', () => {
    const result = render(<Constructor serverUrl={null} query={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with undefined query', () => {
    const server = getServer(servers, 'withVariables');
    const serverUrl = getServerUrl(server);
    const result = render(<Constructor serverUrl={serverUrl} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with serverUrl and query parameters', () => {
    const server = getServer(servers, 'withVariables');
    const serverUrl = getServerUrl(server);
    const channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    const result = render(<Constructor serverUrl={serverUrl} query={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });
});

