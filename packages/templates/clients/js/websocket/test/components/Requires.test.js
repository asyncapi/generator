import { Requires } from '../../components/Requires';

describe('testing of requires function', () => {
  jest.setTimeout(100000);

  test('render websockts require statement correctly', () => {
    const wrapper = Requires();
    expect(wrapper).toMatchSnapshot();
  });
});
