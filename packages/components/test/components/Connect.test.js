import { render } from '@asyncapi/generator-react-sdk';
import { Connect } from '../../src/index';

describe('Testing of Connect function', () => {
  const languages = ['javascript', 'python', 'dart'];
  it.each(languages)('render %s Connect method', (language) => {
    const result = render(
      <Connect 
        language={language} 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws an error when unsupported language is provided', () => {
    expect(() => render(
      <Connect 
        language='java'
        title='HoppscotchEchoWebSocketClient'
      />
    )).toThrow(/Unsupported language "java". Supported languages:/);
  });

  test('throws an error when language is not provided', () => {
    expect(() => render(
      <Connect 
        title='HoppscotchEchoWebSocketClient'
      />
    )).toThrow(/Language is required. Supported languages:/);
  });
});