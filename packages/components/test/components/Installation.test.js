import { render } from '@asyncapi/generator-react-sdk';
import { Installation } from '../../src/components/readme/Installation';

describe('Installation component', () => {
  test('renders javascript installation command', () => {
    const result = render(<Installation language="javascript" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders python installation command', () => {
    const result = render(<Installation language="python" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders installation section when language is undefined', () => {
    const result = render(<Installation />);
    expect(result.trim()).toMatchSnapshot();
  });
});