import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getServer, getServerUrl, getQueryParams } from '@asyncapi/generator-helpers';
import { InitSignature } from '../../components/InitSignature.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('InitSignature component (integration with AsyncAPI document)', () => {
  let servers;
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    servers = parsedAsyncAPIDocument.servers();
  });

  test('renders with only serverUrl (no query parameters)', () => {
    const server = getServer(servers, 'withHostDuplicatingProtocol');
    const serverUrl = getServerUrl(server);
    const result = render(<InitSignature queryParams={null} serverUrl={serverUrl} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with empty query parameters array', () => {
    const server = getServer(servers, 'withVariables');
    const serverUrl = getServerUrl(server);
    const result = render(<InitSignature queryParams={[]} serverUrl={serverUrl} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with single query parameter with default value false', () => {
    const server = getServer(servers, 'withPathname');
    const serverUrl = getServerUrl(server);
    const queryParamsWithFalseDefault = [['heartbeat', 'false']];
    const result = render(<InitSignature queryParams={queryParamsWithFalseDefault} serverUrl={serverUrl} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with single query parameter with default value true', () => {
    const server = getServer(servers, 'withoutPathName');
    const serverUrl = getServerUrl(server);
    const queryParamsWithTrueDefault = [['bids', 'true']];
    const result = render(<InitSignature queryParams={queryParamsWithTrueDefault} serverUrl={serverUrl} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with multiple query parameters with mixed default values', () => {
    const server = getServer(servers, 'withVariables');
    const serverUrl = getServerUrl(server);
    const channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    const queryParamsArray = queryParams && Array.from(queryParams.entries());
    const result = render(<InitSignature queryParams={queryParamsArray} serverUrl={serverUrl} />);
    expect(result.trim()).toMatchSnapshot();
  });
});