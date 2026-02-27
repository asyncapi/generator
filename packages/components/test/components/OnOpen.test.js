import { render } from '@asyncapi/generator-react-sdk';
import { OnOpen } from '../../src/index';

describe('Testing of OnOpen function', () => {
  const languages = ['javascript', 'python'];
  
  test.each(languages)('render %s OnOpen method', (language) => {
    const result = render(
      <OnOpen 
        language={language} 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render java quarkas OnOpen method', () => {
    const result = render(
      <OnOpen 
        language='java'
        framework='quarkus' 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws error for unsupported language', () => {
    expect(() =>
      render(
        <OnOpen
          language="go"
          title="HoppscotchEchoWebSocketClient"
        />
      )
    ).toThrow(/Unsupported language "go". Supported languages:/);
  });

  test('throws error when framework is missing for java', () => {
    expect(() =>
      render(
        <OnOpen
          language="java"
          title="HoppscotchEchoWebSocketClient"
        />
      )
    ).toThrow(/Framework is required for language "java". Supported frameworks:/);
  });

  test('throws error for unsupported framework in java', () => {
    expect(() =>
      render(
        <OnOpen
          language="java"
          framework="spring"
          title="HoppscotchEchoWebSocketClient"
        />
      )
    ).toThrow(/Unsupported framework "spring" for language "java". Supported frameworks:/);
  });

  test('ignores framework for javascript', () => {
    const result = render(
      <OnOpen
        language="javascript"
        framework="randomFramework"
        title="HoppscotchEchoWebSocketClient"
      />
    );

    expect(result.trim()).toMatchSnapshot();
  });
});