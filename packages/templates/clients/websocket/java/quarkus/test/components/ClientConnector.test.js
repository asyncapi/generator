import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import ClientConnector from '../../components/ClientConnector.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('ClientConnector component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParams;
  let operations;
  let pathName;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    queryParams = getQueryParams(channels);
    operations = parsedAsyncAPIDocument.operations();
    
    const servers = parsedAsyncAPIDocument.servers();
    const server = servers.all()[0];
    pathName = server.pathname();
  });

  test('renders with default path when pathName is null', () => {
    const result = render(
      <ClientConnector 
        clientName="WebSocketClient" 
        query={queryParams} 
        pathName={null} 
        operations={operations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with default path when pathName is undefined', () => {
    const result = render(
      <ClientConnector 
        clientName="WebSocketClient" 
        query={queryParams} 
        operations={operations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with path from fixture', () => {
    const result = render(
      <ClientConnector 
        clientName="WebSocketClient" 
        query={queryParams} 
        pathName={pathName} 
        operations={operations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});