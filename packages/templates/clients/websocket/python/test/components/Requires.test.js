import { render } from '@asyncapi/generator-react-sdk';
import { Requires } from '../../components/Requires';

describe('Requires component', () => {
  test('renders correctly when query is true', () => {
    const result = render(<Requires query={true} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders correctly when query is false', () => {
    const result = render(<Requires query={false} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders correctly when query is undefined', () => {
    const result = render(<Requires />);
    expect(result.trim()).toMatchSnapshot();
  });
});
