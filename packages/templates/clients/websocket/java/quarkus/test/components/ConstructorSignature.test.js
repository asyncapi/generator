import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { ConstructorSignature } from '../../components/ConstructorSignature.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('ConstructorSignature component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let channels;
  let queryParamsArray;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    channels = parsedAsyncAPIDocument.channels();

    // Fetch all channel parameters with our new helper
    const allQueryParams = getQueryParams(channels);
    
    // Extract the parameters from the first channel into an array for the tests
    queryParamsArray = null;
    if (allQueryParams) {
      const firstChannelName = Object.keys(allQueryParams)[0];
      queryParamsArray = Object.entries(allQueryParams[firstChannelName]);
    }
  });

  test('renders nothing when queryParams is null', () => {
    const result = render(
      <ConstructorSignature
        clientName="WebSocketClient"
        queryParams={null}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when queryParams is undefined', () => {
    const result = render(
      <ConstructorSignature
        clientName="WebSocketClient"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders constructor signature with empty parameters when queryParams is empty array', () => {
    const result = render(
      <ConstructorSignature
        clientName="WebSocketClient"
        queryParams={[]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders constructor signature with query parameters from fixture', () => {
    const result = render(
      <ConstructorSignature
        clientName="WebSocketClient"
        queryParams={queryParamsArray}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});