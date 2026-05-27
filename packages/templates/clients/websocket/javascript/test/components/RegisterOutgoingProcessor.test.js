import { render } from '@asyncapi/generator-react-sdk';
import { RegisterOutgoingProcessor } from '../../components/RegisterOutgoingProcessor';

describe('RegisterOutgoingProcessor component', () => {
  it('renders registerOutgoingProcessor method with function guard', async () => {
    const result = await render(<RegisterOutgoingProcessor />);
    expect(result).toContain('registerOutgoingProcessor(processor)');
    expect(result).toContain('this.outgoingProcessors.push(processor)');
    expect(result).toContain("console.warn('Outgoing processor must be a function')");
  });
});
