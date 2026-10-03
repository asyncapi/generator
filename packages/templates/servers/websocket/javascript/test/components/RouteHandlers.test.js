import { render } from '@asyncapi/generator-react-sdk';
import { RouteHandlers } from '../../components/RouteHandlers';

describe('RouteHandlers component', () => {
  it('renders routing and message dispatching methods', async () => {
    const result = await render(<RouteHandlers />);

    expect(result).toContain('registerMessageHandler(operationId, handler)');
    expect(result).toContain('registerErrorHandler(handler)');
    expect(result).toContain('registerConnectionHandler(handler)');
    expect(result).toContain('matchChannel(pathname)');
    expect(result).toContain('handleConnection(ws, req, channelAddress)');
    expect(result).toContain('validateMessage(validator, parsedPayload)');
    expect(result).toContain('handleError(error, context)');
  });
});
