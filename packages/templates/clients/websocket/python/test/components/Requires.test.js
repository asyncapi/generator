import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getFirstChannelQueryParams } from '@asyncapi/generator-helpers';
import { Requires } from '../../components/Requires.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('Requires component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('renders correctly with query params', () => {
    const channels = parsedAsyncAPIDocument.channels();
    const allQueryParams = getFirstChannelQueryParams(channels);
    
    // Convert the first channel's parameters back into a Map so the test doesn't break
    let queryParams = null;
    if (allQueryParams) {
      const firstChannelName = Object.keys(allQueryParams)[0];
      queryParams = new Map(Object.entries(allQueryParams[firstChannelName]));
    }

    const result = render(<Requires query={queryParams} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders correctly with null query', () => {
    const result = render(<Requires query={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders correctly with undefined query', () => {
    const result = render(<Requires />);
    expect(result.trim()).toMatchSnapshot();
  });
});