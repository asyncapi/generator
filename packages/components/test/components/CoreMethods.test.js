import { render } from '@asyncapi/generator-react-sdk';
import { CoreMethods } from '../../src/components/readme/CoreMethods';

describe('CoreMethods component', () => {
  test('renders core methods for javascript', () => {
    const result = render(<CoreMethods language="javascript" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders core methods for python', () => {
    const result = render(<CoreMethods language="python" />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('throws error for unsupported or missing language', () => {
    expect(() => {
      render(<CoreMethods />);
    }).toThrow('Unsupported language');
  });
});
