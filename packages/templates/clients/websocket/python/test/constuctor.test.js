import { render } from '@asyncapi/generator-react-sdk';
import { Constructor } from '../components/Constructor.js';

describe('Constructor component snapshot tests', () => {
  it('renders correctly with serverUrl and query parameters', () => {
    const query = new Map([
      ['param1', 'value1'],
      ['param2', 'value2']
    ]);
    const result = render(<Constructor serverUrl="wss://example.com" query={query} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  it('renders correctly with only serverUrl', () => {
    const result = render(<Constructor serverUrl="wss://example.com" query={null} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  it('renders correctly without serverUrl and query', () => {
    const result = render(<Constructor serverUrl={null} query={null} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});