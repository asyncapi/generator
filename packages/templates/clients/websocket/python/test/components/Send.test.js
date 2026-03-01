import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Send } from '../../components/Send';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('Testing of Send component', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
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