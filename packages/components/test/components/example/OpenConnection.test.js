import { render } from '@asyncapi/generator-react-sdk';
import { OpenConnection } from '../../../src/index';

describe('Testing of OpenConnection function', () => {
  const languages = ['javascript', 'python', 'dart'];

  it.each(languages)('render %s example connect line', (language) => {
    const result = render(
      <OpenConnection language={language} instanceName="echoClient" />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws when language is unsupported', () => {
    expect(() => render(
      <OpenConnection language="java" instanceName="echoClient" />
    )).toThrow(/Unsupported language "java"\. Supported languages:/);
  });

  test('throws when language is missing', () => {
    expect(() => render(
      <OpenConnection instanceName="echoClient" />
    )).toThrow(/Language is required\. Supported languages:/);
  });
});
