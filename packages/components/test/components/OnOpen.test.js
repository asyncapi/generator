import { render } from '@asyncapi/generator-react-sdk';
import { OnOpen } from '../../src/index';

describe('Testing of OnOpen function', () => {
  test('render javascript OnOpen method', () => {
    const result = render(
      <OnOpen 
        language='javascript' 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python OnOpen method', () => {
    const result = render(
      <OnOpen 
        language='python'
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
