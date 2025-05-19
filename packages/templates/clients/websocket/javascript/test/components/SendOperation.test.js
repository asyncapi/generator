import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { SendOperation } from '../../components/SendOperation';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of SendOperation function', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render websockets with send operations and client name', () => {
    const result = render(
      <SendOperation 
        clientName='GeminiMarketDataWebsocketAPI'
        sendOperations={parsedAsyncAPIDocument.operations().filterBySend()} 
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render websockets without send operations', () => {
    const result = render(
      <SendOperation 
        clientName='GeminiMarketDataWebsocketAPI'
        sendOperations={null} 
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
