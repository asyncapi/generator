import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ExampleExchange } from '../../components/ExampleExchange';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../../clients/websocket/test/__fixtures__/asyncapi-websocket-components.yml');

describe('ExampleExchange component', () => {
  let receiveOperations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    receiveOperations = parseResult.document.channels().get('testChannel').operations().filterByReceive();
  });

  test('sends one message for every receive operation of the channel', () => {
    const result = render(<ExampleExchange address="/test" receiveOperations={receiveOperations} />);

    // The messages of the fixture have no examples, so each message is a placeholder that names its operation.
    expect(result).toBe('  await exchangeMessages(\'/test\', ["TODO: replace with a message for receiveMessage", "TODO: replace with a message for receiveNotification"]);\n');
  });

  test('sends nothing when the channel has no receive operation', () => {
    const result = render(<ExampleExchange address="/test" receiveOperations={[]} />);

    expect(result).toBe('  await exchangeMessages(\'/test\', []);\n');
  });

  test('adds a leading slash to an address that has none', () => {
    const result = render(<ExampleExchange address="chatRoom" receiveOperations={[]} />);

    expect(result).toBe('  await exchangeMessages(\'/chatRoom\', []);\n');
  });
});
