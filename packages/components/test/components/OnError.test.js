import { render } from '@asyncapi/generator-react-sdk';
import { OnError } from '../../src/index';

describe('Testing of OnError function', () => {
  test('render javascript OnError method', () => {
    const result = render(
      <OnError language='javascript' />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render python OnError method', () => {
    const result = render(
      <OnError 
        language='python'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  
  test('render dart OnError method', () => {
    const result = render(
      <OnError 
        language='dart'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});
