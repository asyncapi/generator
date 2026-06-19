import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { QueryParamsArgumentsDocs } from '../../components/QueryParamsArgumentsDocs';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('QueryParamsArgumentsDocs component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render documentation for WebSocket query parameters when they exist in the AsyncAPI document', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    const queryParamsArray = queryParams && Array.from(queryParams.entries());
    const result = render(<QueryParamsArgumentsDocs queryParams={queryParamsArray} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('render nothing when empty query parameters array is provided', () => {
    const result = render(<QueryParamsArgumentsDocs queryParams={[]} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('render nothing when no query parameters are provided (null input)', () => {
    const result = render(<QueryParamsArgumentsDocs queryParams={null} />);
    expect(result.trim()).toMatchSnapshot();
  });
});