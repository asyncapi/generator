import { render } from '@asyncapi/generator-react-sdk';
import { OnClose } from '../../src/index';

describe('Testing of OnClose function', () => {
  const languages = ['javascript', 'python', 'dart'];
  
  test.each(languages)('render %s OnClose method', (language) => {
    const result = render(
      <OnClose 
        language={language} 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render java quarkas OnClose method', () => {
    const result = render(
      <OnClose 
        language='java'
        framework='quarkus' 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('ignores framework for languages that do not use frameworks', () => {
    const result = render(
      <OnClose
        language="javascript"
        framework="react"
        title="HoppscotchEchoWebSocketClient"
      />
    );

    expect(result.trim()).toMatchSnapshot();
  });

  test('throws an error for unsupported language', () => {
    expect(() =>
      render(
        <OnClose
          language="go"
          title="HoppscotchEchoWebSocketClient"
        />
      )
    ).toThrow(/Unsupported language "go". Supported languages:/);
  });

  test('throws error for unsupported framework in java', () => {
    expect(() =>
      render(
        <OnClose
          language="java"
          framework="spring"
          title="HoppscotchEchoWebSocketClient"
        />
      )
    ).toThrow(/Unsupported framework "spring" for language "java". Supported frameworks:/);
  });

  test('throws error when framework missing for java', () => {
    expect(() =>
      render(
        <OnClose
          language="java"
          title="HoppscotchEchoWebSocketClient"
        />
      )
    ).toThrow(/Framework is required for language "java". Supported frameworks:/);
  });
});
