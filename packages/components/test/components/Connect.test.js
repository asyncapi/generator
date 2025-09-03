import { render } from '@asyncapi/generator-react-sdk';
import { Connect } from '../../src/index';

describe('Testing of Connect function', () => {
  test('render javascript Connect method', () => {
    const result = render(
      <Connect 
        language='javascript' 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python Connect method', () => {
    const result = render(
      <Connect 
        language='python'
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart Connect method', () => {
    const result = render(
      <Connect 
        language='dart'
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
