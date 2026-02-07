import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { DefaultConstructorSignature } from '../../components/DefaultConstructorSignature.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('DefaultConstructorSignature component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParamsArray;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    
    const queryParams = getQueryParams(channels);
    queryParamsArray = queryParams ? Array.from(queryParams.entries()) : null;
  });

  test('renders nothing when queryParams is null', () => {
    const result = render(<DefaultConstructorSignature clientName="WebSocketClient" queryParams={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when queryParams is undefined', () => {
    const result = render(<DefaultConstructorSignature clientName="WebSocketClient" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when queryParams is empty array', () => {
    const result = render(<DefaultConstructorSignature clientName="WebSocketClient" queryParams={[]} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders default constructor with query parameters from fixture', () => {
    const result = render(<DefaultConstructorSignature clientName="WebSocketClient" queryParams={queryParamsArray} />);
    expect(result.trim()).toMatchSnapshot();
  });
});