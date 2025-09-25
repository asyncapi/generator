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
});