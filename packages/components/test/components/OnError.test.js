import { render } from '@asyncapi/generator-react-sdk';
import { OnError } from '../../src/index';

describe('Testing of OnError function', () => {
  const languages = ['javascript', 'python', 'dart'];
  
  test.each(languages)('render %s OnError method', (language) => {
    const result = render(
      <OnError language={language} />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws error for unsupported language', () => {
    expect(() =>
      render(<OnError language="java" />)
    ).toThrow(/Unsupported language "java". Supported languages:/);
  });
});