import { render } from '@asyncapi/generator-react-sdk';
import { SendOperations } from '../../components/SendOperations';

describe('SendOperations component', () => {
  it('renders broadcast and typed computed send operation methods', async () => {
    const sendOperations = [
      {
        id: 'sendTimeStampMessage',
        channelAddress: '/'
      }
    ];

    const result = await render(
      <SendOperations sendOperations={sendOperations} />
    );

    expect(result).toContain('broadcast(channelAddress, payload)');
    expect(result).toContain('async ["sendTimeStampMessage"](payload, targetWs = null)');
    expect(result).toContain('validateMessage');
  });

  it('throws an error when operation ID matches a reserved method name', () => {
    const sendOperations = [
      {
        id: 'start',
        channelAddress: '/'
      }
    ];

    expect(() => SendOperations({ sendOperations })).toThrow(
      'Operation ID "start" conflicts with reserved WebSocketServer method name.'
    );
  });
});
