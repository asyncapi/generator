import { render } from '@asyncapi/generator-react-sdk';
import { OnOpen } from '../../src/index';

describe('Testing of OnOpen function', () => {
  const languages = ['javascript', 'python'];
  
  it.each(languages)('render %s OnOpen method', (language) => {
    const result = render(
      <OnOpen 
        language={language} 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});