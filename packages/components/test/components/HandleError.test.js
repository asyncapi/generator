import { render } from '@asyncapi/generator-react-sdk';
import { HandleError } from '../../src/index';

describe('Testing of HandleError component', () => {
  test('renders python websocket handle error method', () => {
    const result = render(<HandleError language='python' />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders dart websocket handle error method', () => {
    const result = render(<HandleError language='dart' />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders java quarkus websocket handle error method', () => {
    const result = render(<HandleError language='java' framework='quarkus' />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('ignores framework when language has no framework discriminator', () => {
    const result = render(<HandleError language='python' framework='ignored' />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('throws when language is not supported', () => {
    expect(() => render(<HandleError language='go' />))
      .toThrow(/Unsupported language "go". Supported languages:/);
  });

  test('throws when java framework is missing', () => {
    expect(() => render(<HandleError language='java' />))
      .toThrow(/Framework is required for language "java". Supported frameworks:/);
  });

  test('throws when java framework is unknown', () => {
    expect(() => render(<HandleError language='java' framework='spring' />))
      .toThrow(/Unsupported framework "spring" for language "java". Supported frameworks:/);
  });
});
