import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { ClientFields } from '../../components/ClientFields.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('ClientFields component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParams;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    queryParams = getQueryParams(channels);
  });

  test('renders base fields without query param fields when queryParams is null', () => {
    const result = render(
      <ClientFields 
        queryParams={null} 
        clientName="WebSocketClient" 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders base fields without query param fields when queryParams is undefined', () => {
    const result = render(
      <ClientFields 
        clientName="WebSocketClient" 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders base fields without query param fields when queryParams is empty Map', () => {
    const emptyMap = new Map();
    const result = render(
      <ClientFields 
        queryParams={emptyMap} 
        clientName="WebSocketClient" 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders base fields with query param fields when queryParams has data from fixture', () => {
    const result = render(
      <ClientFields 
        queryParams={queryParams} 
        clientName="WebSocketClient" 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});