import { render } from '@asyncapi/generator-react-sdk';
import { Constructor } from '../../components/Constructor';

describe('Constructor component', () => {
  it('renders constructor with channel configuration', async () => {
    const channelsInfo = [
      {
        address: '/echo',
        receiveOps: ['handleEchoMessage'],
        sendOps: ['sendTimeStampMessage']
      }
    ];

    const result = await render(
      <Constructor
        channelsInfo={channelsInfo}
        receiveOps={['handleEchoMessage']}
        sendOps={['sendTimeStampMessage']}
        allOps={['handleEchoMessage', 'sendTimeStampMessage']}
        defaultPort="8080"
      />
    );

    expect(result).toContain('constructor(options = {})');
    expect(result).toContain('this.channels = {};');
    expect(result).toContain('/echo');
    expect(result).toContain('handleEchoMessage');
    expect(result).toContain('sendTimeStampMessage');
  });
});
