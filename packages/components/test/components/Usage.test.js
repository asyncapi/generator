import { render } from '@asyncapi/generator-react-sdk';
import { Usage } from '../../src/components/readme/Usage';

describe('Testing of Usage component', () => {
  const supportedCases = [
    {
      language: 'python',
      clientFileName: 'my_client.py',
    },
    {
      language: 'javascript',
      clientFileName: 'myClient.js',
    },
  ];

  test.each(supportedCases)(
    'renders usage snippet for %s',
    ({ language, clientFileName }) => {
      const result = render(
        <Usage
          clientName="MyClient"
          clientFileName={clientFileName}
          language={language}
        />
      );

      expect(result.trim()).toMatchSnapshot();
    }
  );

  test('throws error for unsupported language', () => {
    expect(() =>
      render(
        <Usage
          clientName="MyClient"
          clientFileName="myClient.js"
          language="go"
        />
      )
    ).toThrow(/Unsupported language "go". Supported languages:/);
  });

  test('throws error for empty clientName', () => {
    expect(() =>
      render(
        <Usage
          clientName=""
          clientFileName="myClient.js"
          language="javascript"
        />
      )
    ).toThrow(/Invalid client name. Expected a non-empty string. Received:/);
  });

  test('throws error for empty clientFileName', () => {
    expect(() =>
      render(
        <Usage
          clientName="MyClient"
          clientFileName=""
          language="javascript"
        />
      )
    ).toThrow(/Invalid client file name. Expected a non-empty string. Received:/);
  });
});
