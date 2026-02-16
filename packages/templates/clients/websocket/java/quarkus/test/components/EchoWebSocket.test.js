import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams, getTitle } from '@asyncapi/generator-helpers';
import { EchoWebSocket } from '../../components/EchoWebSocket.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('EchoWebSocket component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParams;
  let operations;
  let title;
  let pathName;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    queryParams = getQueryParams(channels);
    operations = parsedAsyncAPIDocument.operations();
    title = getTitle(parsedAsyncAPIDocument);
    const servers = parsedAsyncAPIDocument.servers();
    const server = servers.all()[0];
    pathName = server.pathname();
  });

  test('renders with default path when pathName is null', () => {
    const result = render(
      <EchoWebSocket 
        clientName="WebSocketClient" 
        pathName={null} 
        title={title} 
        queryParams={queryParams} 
        operations={operations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with default path when pathName is undefined', () => {
    const result = render(
      <EchoWebSocket 
        clientName="WebSocketClient" 
        title={title} 
        queryParams={queryParams} 
        operations={operations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with path from fixture', () => {
    const result = render(
      <EchoWebSocket 
        clientName="WebSocketClient" 
        pathName={pathName} 
        title={title} 
        queryParams={queryParams} 
        operations={operations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});