import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { QueryParamsArgumentsDocs } from '../../components/QueryParamsArgumentsDocs.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('QueryParamsArgumentsDocs component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('renders with query parameters', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    const queryParamsArray = queryParams && Array.from(queryParams.entries());
    const result = render(<QueryParamsArgumentsDocs queryParams={queryParamsArray} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders empty with empty array', () => {
    const result = render(<QueryParamsArgumentsDocs queryParams={[]} />);
    expect(result).toBe('');
  });

  test('renders empty with null', () => {
    const result = render(<QueryParamsArgumentsDocs queryParams={null} />);
    expect(result).toBe('');
  });
});
