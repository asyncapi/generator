import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Send } from '../../components/Send';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of Send component', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render Send component with send operations', () => {
    const sendOperations = parsedAsyncAPIDocument.operations().filterBySend();
    const result = render(<Send sendOperations={sendOperations} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('renders nothing when send operations is empty', () => {
    const result = render(<Send sendOperations={[]} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  test('render nothing when send operations is null', () => {
    const result = render(<Send sendOperations={null} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  test('renders nothing without send operations', () => {
    const result = render(<Send />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});