import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Route } from '../../components/Route';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../../clients/websocket/test/__fixtures__/asyncapi-websocket-components.yml');

const SEND_MESSAGE_CALL = 'await sendMessage(ws);';
const MESSAGE_LISTENER = 'ws.on(\'message\'';

describe('Route component', () => {
  let sendOperations;
  let receiveOperations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    const operations = parseResult.document.channels().get('testChannel').operations();
    sendOperations = operations.filterBySend();
    receiveOperations = operations.filterByReceive();
  });

  test('calls every send handler on connect and every receive handler for each message', () => {
    const result = render(<Route address="/test" sendOperations={sendOperations} receiveOperations={receiveOperations} />);

    expect(result).toContain(SEND_MESSAGE_CALL);
    expect(result).toContain('await sendNotification(ws);');
    expect(result).toContain('await receiveMessage(ws, { message: msg, path, query });');
    expect(result).toContain('await receiveNotification(ws, { message: msg, path, query });');
    expect(result).toMatchSnapshot();
  });

  test('starts listening for messages before it calls the send handlers', () => {
    const result = render(<Route address="/test" sendOperations={sendOperations} receiveOperations={receiveOperations} />);

    // A send handler can take time. A message the client sends meanwhile must not be lost.
    expect(result.indexOf(MESSAGE_LISTENER)).toBeLessThan(result.indexOf(SEND_MESSAGE_CALL));
  });

  test('catches an error that a receive handler throws', () => {
    const result = render(<Route address="/test" sendOperations={[]} receiveOperations={receiveOperations} />);

    expect(result).toContain('    try {\n      await receiveMessage(ws, { message: msg, path, query });');
    expect(result).toContain('    } catch (err) {\n      console.error(err);\n    }');
  });

  test('calls the receive handlers in document order', () => {
    const result = render(<Route address="/test" sendOperations={[]} receiveOperations={receiveOperations} />);

    expect(result.indexOf('await receiveMessage(')).toBeLessThan(result.indexOf('await receiveNotification('));
  });

  test('listens for messages only when the channel has a receive operation', () => {
    const result = render(<Route address="/test" sendOperations={sendOperations} receiveOperations={[]} />);

    expect(result).toContain(SEND_MESSAGE_CALL);
    expect(result).not.toContain(MESSAGE_LISTENER);
  });

  test('calls no handler on connect when the channel has no send operation', () => {
    const result = render(<Route address="/test" sendOperations={[]} receiveOperations={receiveOperations} />);

    expect(result).not.toContain('(ws);');
    expect(result).toContain(MESSAGE_LISTENER);
  });

  test('adds a leading slash to an address that has none', () => {
    const result = render(<Route address="chatRoom" sendOperations={[]} receiveOperations={[]} />);

    expect(result).toContain('routes.set(\'/chatRoom\', async (ws, { path, query }) => {');
  });
});
