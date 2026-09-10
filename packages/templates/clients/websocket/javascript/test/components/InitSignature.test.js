import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { InitSignature } from '../../components/InitSignature.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('InitSignature component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('renders with no query parameters', () => {
    const result = render(<InitSignature queryParams={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with empty query parameters array', () => {
    const result = render(<InitSignature queryParams={[]} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with single query parameter with default value false', () => {
    const queryParamsWithFalseDefault = [['heartbeat', 'false']];
    const result = render(<InitSignature queryParams={queryParamsWithFalseDefault} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with single query parameter with default value true', () => {
    const queryParamsWithTrueDefault = [['bids', 'true']];
    const result = render(<InitSignature queryParams={queryParamsWithTrueDefault} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with multiple query parameters with mixed default values', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    const queryParamsArray = queryParams && Array.from(queryParams.entries());
    const result = render(<InitSignature queryParams={queryParamsArray} />);
    expect(result.trim()).toMatchSnapshot();
  });
  test('renders with single query parameter without default value', () => {
    const queryParamsWithoutDefault = [['token', undefined]];
    const result = render(<InitSignature queryParams={queryParamsWithoutDefault} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with single query parameter with default value as primitive boolean', () => {
    const queryParams = [['bids', false]];
    const result = render(<InitSignature queryParams={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with single query parameter with default value as primitive number', () => {
    const queryParams = [['count', 42]];
    const result = render(<InitSignature queryParams={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with single query parameter with default value as stringified number', () => {
    const queryParams = [['count', '42']];
    const result = render(<InitSignature queryParams={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders with single query parameter with explicit empty string default', () => {
    const queryParams = [['token', '']];
    const result = render(<InitSignature queryParams={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });
});
