import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { ClientDependencies } from '../../components/dependencies/ClientDependencies';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('ClientDependencies component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParams;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();
    
    // Fetch all channel parameters with our new helper
    const allQueryParams = getQueryParams(channels);
    
    // Convert the first channel's parameters back into a Map for the tests
    queryParams = null;
    if (allQueryParams) {
      const firstChannelName = Object.keys(allQueryParams)[0];
      queryParams = new Map(Object.entries(allQueryParams[firstChannelName]));
    }
  });

  test('renders base dependencies without HashMap import when queryParams is null', () => {
    const result = render(<ClientDependencies queryParams={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders base dependencies without HashMap import when queryParams is undefined', () => {
    const result = render(<ClientDependencies />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders dependencies with HashMap import when queryParams is empty Map', () => {
    const emptyMap = new Map();
    const result = render(<ClientDependencies queryParams={emptyMap} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders dependencies with HashMap import when queryParams has data from fixture', () => {
    const result = render(<ClientDependencies queryParams={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });
});