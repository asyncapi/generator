import { render } from '@asyncapi/generator-react-sdk';
import { OnClose } from '../../src/index';

describe('Testing of OnClose function', () => {
  const languages = ['javascript', 'python', 'dart'];
  
  it.each(languages)('render %s OnClose method', (language) => {
    const result = render(
      <OnClose 
        language={language} 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
