import { render } from '@asyncapi/generator-react-sdk';
import { OnMessage } from '../../src/index';

describe('Testing of OnMessage function', () => {
  test('render javascript OnMessage method', () => {
    const result = render(
      <OnMessage language='javascript' />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python OnMessage method', () => {
    const result = render(
      <OnMessage 
        language='python'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  
  test('render dart OnMessage method', () => {
    const result = render(
      <OnMessage 
        language='dart'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
