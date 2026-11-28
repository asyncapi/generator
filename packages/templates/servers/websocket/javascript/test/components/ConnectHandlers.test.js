import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ConnectHandlers } from '../../components/ConnectHandlers';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../../clients/websocket/test/__fixtures__/asyncapi-websocket-components.yml');

describe('ConnectHandlers component', () => {
  let sendOperations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    sendOperations = parseResult.document.channels().get('testChannel').operations().filterBySend();
  });

  test('renders one connect handler for every send operation of the channel', () => {
    const result = render(<ConnectHandlers operations={sendOperations} />);

    expect(result).toContain('service.sendMessage = async (ws) => {');
    expect(result).toContain('service.sendNotification = async (ws) => {');
    expect(result).toMatchSnapshot();
  });

  test('puts a blank line before every handler', () => {
    const result = render(<ConnectHandlers operations={sendOperations} />);

    expect(result.startsWith('\n/**')).toBe(true);
    expect(result).toContain('};\n\n/**');
  });

  test('renders nothing when the channel has no send operation', () => {
    const result = render(<ConnectHandlers operations={[]} />);

    expect(result).toBe('');
  });
});
