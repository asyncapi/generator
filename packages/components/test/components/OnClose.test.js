import { render } from '@asyncapi/generator-react-sdk';
import { OnClose } from '../../src/index';

describe('Testing of OnClose function', () => {
  test('render javascript OnClose method', () => {
    const result = render(
      <OnClose 
        language='javascript' 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python OnClose method', () => {
    const result = render(
      <OnClose 
        language='python'
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python OnClose method', () => {
    const result = render(
      <OnClose 
        language='dart'
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
