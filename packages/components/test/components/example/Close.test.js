import { render } from '@asyncapi/generator-react-sdk';
import { Close } from '../../../src/index';

describe('Testing of Close function', () => {
  const languages = ['javascript', 'python', 'dart'];

  it.each(languages)('render %s example close line', (language) => {
    const result = render(
      <Close language={language} instanceName="echoClient" />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws when language is unsupported', () => {
    expect(() => render(
      <Close language="java" instanceName="echoClient" />
    )).toThrow(/Unsupported language "java"\. Supported languages:/);
  });
});
