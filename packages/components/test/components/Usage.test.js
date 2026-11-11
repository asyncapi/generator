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

  test('renders javascript throwSendErrors hint that skips query parameters', () => {
    const result = render(
      <Usage
        clientName="MyClient"
        clientFileName="myClient.js"
        language="javascript"
        queryParams={[['ticket', ''], ['app_id', '']]}
      />
    );

    expect(result).toContain('new MyClient(undefined, undefined, undefined, false)');
    expect(result).toContain('// Arguments are (url, ticket, appId, throwSendErrors).');
    expect(result.trim()).toMatchSnapshot();
  });

  test('names javascript query params in the hint the same way as the constructor reserved names', () => {
    const result = render(
      <Usage
        clientName="MyClient"
        clientFileName="myClient.js"
        language="javascript"
        queryParams={[['url', ''], ['ticket', '']]}
        reservedNames={new Set(['url'])}
      />
    );

    expect(result).toContain('// Arguments are (url, _url, ticket, throwSendErrors).');
  });

  test('renders the same javascript hint for an empty queryParams array as without it', () => {
    const withEmpty = render(
      <Usage clientName="MyClient" clientFileName="myClient.js" language="javascript" queryParams={[]} />
    );
    const without = render(
      <Usage clientName="MyClient" clientFileName="myClient.js" language="javascript" />
    );

    expect(withEmpty).toBe(without);
    expect(withEmpty).toContain('new MyClient(undefined, false)');
  });

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
