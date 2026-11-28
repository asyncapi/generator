import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { MessageHandlers } from '../../components/MessageHandlers';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../../clients/websocket/test/__fixtures__/asyncapi-websocket-components.yml');

describe('MessageHandlers component', () => {
  let receiveOperations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    receiveOperations = parseResult.document.channels().get('testChannel').operations().filterByReceive();
  });

  test('renders one message handler for every receive operation of the channel', () => {
    const result = render(<MessageHandlers operations={receiveOperations} />);

    expect(result).toContain('service.receiveMessage = async (ws, { message, path, query }) => {');
    expect(result).toContain('service.receiveNotification = async (ws, { message, path, query }) => {');
    expect(result).toMatchSnapshot();
  });

  test('documents the payload properties of every message of an operation', () => {
    // The receiveMessage operation of the fixture has two messages: testMessage and messageWithDiscriminator.
    const receiveMessage = receiveOperations.filter((operation) => operation.id() === 'receiveMessage');
    const result = render(<MessageHandlers operations={receiveMessage} />);

    expect(result).toContain('options.message.payload.content');
    expect(result).toContain('options.message.payload.messageType');
  });

  test('puts a blank line before every handler', () => {
    const result = render(<MessageHandlers operations={receiveOperations} />);

    expect(result.startsWith('\n/**')).toBe(true);
    expect(result).toContain('};\n\n/**');
  });

  test('renders nothing when the channel has no receive operation', () => {
    const result = render(<MessageHandlers operations={[]} />);

    expect(result).toBe('');
  });
});
