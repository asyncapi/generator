import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { RegisterReceiveOperations } from '../../components/RegisterReceiveOperations';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('Testing of RegisterReceiveOperations component', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render RegisterReceiveOperations component with receive operations', () => {
    const receiveOperations = parsedAsyncAPIDocument.operations().filterByReceive();
    const result = render(<RegisterReceiveOperations receiveOperations={receiveOperations} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('renders nothing when receive operations is empty', () => {
    const result = render(<RegisterReceiveOperations receiveOperations={[]} />);
    const actual = result.trim();
    expect(actual).toBe('');
  });

  test('renders nothing when receive operations is null', () => {
    const result = render(<RegisterReceiveOperations receiveOperations={null} />);
    const actual = result.trim();
    expect(actual).toBe('');
  });

  test('renders nothing without receive operations', () => {
    const result = render(<RegisterReceiveOperations />);
    const actual = result.trim();
    expect(actual).toBe('');
  });
});
