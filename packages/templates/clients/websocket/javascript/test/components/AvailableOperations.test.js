import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { AvailableOperations } from '../../components/AvailableOperations';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing AvailableOperations component', () => {
  let parsedAsyncAPIDocument;
  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('Must render all available operations', () => {
    const operations = parsedAsyncAPIDocument.operations().all();
    const result = render(<AvailableOperations operations={operations} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  }); 

  test('Must not render anything if operations are passed as empty array.', () => {
    const result = render(<AvailableOperations operations={[]} />);
    const actual = result.trim();
    expect(actual).toBe('');
  });
  test('Must not render anything if operations are passed as null', () => {
    const result = render(<AvailableOperations operations={null} />);
    const actual = result.trim();
    expect(actual).toBe('');
  });
});
