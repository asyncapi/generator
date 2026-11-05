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

  test('renders with multiple query parameters from the AsyncAPI document', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const queryParams = getQueryParams(channels);
    const queryParamsArray = queryParams && Array.from(queryParams.entries());
    const result = render(<InitSignature queryParams={queryParamsArray} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('does not emit spec default values as parameter defaults', () => {
    const queryParams = [['heartbeat', 'false'], ['count', 42], ['token', 'abc'], ['sessionId', undefined]];
    const result = render(<InitSignature queryParams={queryParams} />);
    expect(result.trim()).toBe('constructor(url, heartbeat, count, token, sessionId, throwSendErrors = true) {');
  });
});
