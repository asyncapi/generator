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
});
