import { render } from '@asyncapi/generator-react-sdk';
import { Imports } from '../../../src/index';

describe('Testing of Imports function', () => {
  test('render javascript imports', () => {
    const result = render(
      <Imports
        language="javascript"
        clientName="EchoClient"
        clientFileName="echoClient.js"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('render python imports without needsTime', () => {
    const result = render(
      <Imports
        language="python"
        clientName="EchoClient"
        clientFileName="echo_client.py"
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('render python imports with needsTime', () => {
    const result = render(
      <Imports
        language="python"
        clientName="EchoClient"
        clientFileName="echo_client.py"
        needsTime
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('render dart imports (clientName not used)', () => {
    const result = render(
      <Imports language="dart" clientFileName="echo_client.dart" />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('throws when language is unsupported', () => {
    expect(() => render(
      <Imports language="ruby" clientFileName="client.rb" />
    )).toThrow(/Unsupported language "ruby"\. Supported languages:/);
  });
});
