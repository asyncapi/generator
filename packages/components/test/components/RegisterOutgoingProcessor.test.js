import { render } from '@asyncapi/generator-react-sdk';
import { RegisterOutgoingProcessor } from '../../src/index';

describe('Testing of RegisterOutgoingProcessor function', () => {
  const languages = ['javascript', 'python', 'dart'];

  it.each(languages)('render %s outgoing processor registration method', (language) => {
    const result = render(<RegisterOutgoingProcessor language={language} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws for unsupported language', () => {
    expect(() => render(<RegisterOutgoingProcessor language="go" />))
      .toThrow(/Unsupported language "go"\. Supported languages:/);
  });

  test('throws for a language name inherited from Object.prototype', () => {
    expect(() => render(<RegisterOutgoingProcessor language="constructor" />))
      .toThrow(/Unsupported language "constructor"\. Supported languages:/);
  });

  test('throws when language is missing', () => {
    expect(() => render(<RegisterOutgoingProcessor />))
      .toThrow(/Language is required\. Supported languages:/);
  });
});
