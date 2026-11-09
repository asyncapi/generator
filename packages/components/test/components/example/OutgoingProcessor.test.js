import { render } from '@asyncapi/generator-react-sdk';
import { OutgoingProcessor } from '../../../src/index';

describe('Testing of OutgoingProcessor function', () => {
  const languages = ['javascript', 'python', 'dart'];

  it.each(languages)('render %s example outgoing processor', (language) => {
    const result = render(<OutgoingProcessor language={language} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws when language is missing', () => {
    expect(() => render(<OutgoingProcessor />))
      .toThrow(/Language is required\. Supported languages:/);
  });
});
