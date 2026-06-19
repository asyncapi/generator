import { render } from '@asyncapi/generator-react-sdk';
import { OnMessage } from '../../src/index';

describe('OnMessage renders per language', () => {
  const languages = ['javascript', 'python', 'dart'];
  test.each(languages)('renders %s OnMessage method', (language) => {
    const result = render(<OnMessage language={language} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('throws error for unsupported language', () => {
    expect(() =>
      render(<OnMessage language="java" />)
    ).toThrow(/Unsupported language "java". Supported languages:/);
  });
});