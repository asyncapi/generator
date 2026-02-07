import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { Constructor } from '../../components/Constructor';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('Constructor component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParams;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    queryParams = getQueryParams(channels);
  });

  test('renders nothing when query is null', () => {
    const result = render(<Constructor clientName="WebSocketClient" query={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when query has no entries', () => {
    const emptyQuery = new Map();
    const result = render(<Constructor clientName="WebSocketClient" query={emptyQuery} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders constructor when query parameters are present', () => {
    const result = render(<Constructor clientName="WebSocketClient" query={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });
});