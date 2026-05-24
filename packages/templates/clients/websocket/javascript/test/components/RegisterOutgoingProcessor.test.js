import { render } from '@asyncapi/generator-react-sdk';
import { RegisterOutgoingProcessor } from '../../components/RegisterOutgoingProcessor';

describe('RegisterOutgoingProcessor component', () => {
  it('renders correctly', async () => {
    const result = await render(<RegisterOutgoingProcessor />);
    expect(result).toMatchSnapshot();
  });
});
