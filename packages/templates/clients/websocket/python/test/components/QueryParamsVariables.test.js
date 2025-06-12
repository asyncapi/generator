import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { QueryParamsVariables } from '../../components/QueryParamsVariables.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml'
);

describe('QueryParamsVariables component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('renders correctly with query parameters', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParamsObject = getQueryParams(channels);
    const queryParamsArray = Object.entries(queryParamsObject);
    const result = render(<QueryParamsVariables queryParams={queryParamsArray} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when queryParams is null', () => {
    const result = render(<QueryParamsVariables queryParams={null} />);
    expect(result).toBe('');
  });

  test('renders nothing when queryParams is undefined', () => {
    const result = render(<QueryParamsVariables />);
    expect(result).toBe('');
  });
});
