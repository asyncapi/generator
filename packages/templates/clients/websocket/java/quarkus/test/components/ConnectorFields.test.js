import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { getQueryParams } from '@asyncapi/generator-helpers';
import { ConnectorFields } from '../../components/ConnectorFields.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('ConnectorFields component (integration with AsyncAPI document)', () => {
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

  test('renders connector field without base URI config when queryParamsArray is null', () => {
    const result = render(
      <ConnectorFields
        clientName="WebSocketClient"
        queryParamsArray={null}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders connector field without base URI config when queryParamsArray is undefined', () => {
    const result = render(
      <ConnectorFields
        clientName="WebSocketClient"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders connector field without base URI config when queryParamsArray is empty array', () => {
    const result = render(
      <ConnectorFields
        clientName="WebSocketClient"
        queryParamsArray={[]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders connector field with base URI config when queryParamsArray has data from fixture', () => {
    const result = render(
      <ConnectorFields
        clientName="WebSocketClient"
        queryParamsArray={queryParamsArray}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
