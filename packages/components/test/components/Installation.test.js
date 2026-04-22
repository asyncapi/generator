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

  test('throws error when language is undefined', () => {
    expect(() => {
      render(<Installation />);
    }).toThrow(/Language is required. Supported languages:/);
  });
});