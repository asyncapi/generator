import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { OperationsDiscriminators } from '../../src/components/OperationsDiscriminators';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of OperationsDiscriminators function', () => {
  let parsedAsyncAPIDocument;
  let receiveOperations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
    const operations = parsedAsyncAPIDocument.operations();
    receiveOperations = operations.filterByReceive();
  });

  test('render python websocket operation discrimination', () => {
    const result = render(<OperationsDiscriminators language='python' operations={receiveOperations} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});