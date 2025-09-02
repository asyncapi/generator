import { render } from '@asyncapi/generator-react-sdk';
import { HandleMessage } from '../../src/index';

describe('Testing of HandleMessage function', () => {
  test('render javascript websocket message handler method', () => {
    const result = render(
      <HandleMessage language='javascript' />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python websocket message handler method', () => {
    const result = render(
      <HandleMessage 
        language='python'
        methodParams={['self', 'message']}
        preExecutionCode='"""Pass the incoming message to all registered message handlers. """'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render dart websocket message handler method', () => {
    const result = render(
      <HandleMessage
        language="dart" 
        methodParams={['dynamic message', 'void Function(String) cb']}
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
