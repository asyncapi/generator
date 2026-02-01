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
          clientFileName="my_client.rb"
          language="ruby"
        />
      )
    ).toThrow(
      'Invalid "language" parameter: unsupported value "ruby"'
    );
  });

  test('throws error when language is empty', () => {
    expect(() =>
      render(
        <Usage
          clientName="MyClient"
          clientFileName="my_client.py"
          language=""
        />
      )
    ).toThrow(
      'Invalid "language" parameter: must be a non-empty string, received '
    );
  });

  test('throws error for wrong casing in language', () => {
    expect(() =>
      render(
        <Usage
          clientName="MyClient"
          clientFileName="my_client.py"
          language="Python"
        />
      )
    ).toThrow(
      'Invalid "language" parameter: unsupported value "Python"'
    );
  });

  test('throws error when language is null', () => {
    expect(() =>
      render(
        <Usage
          clientName="MyClient"
          clientFileName="my_client.py"
          language={null}
        />
      )
    ).toThrow(
      'Invalid "language" parameter: must be a non-empty string, received null'
    );
  });

  test('throws error when language is undefined', () => {
    expect(() =>
      render(
        <Usage
          clientName="MyClient"
          clientFileName="my_client.py"
        />
      )
    ).toThrow(
      'Invalid "language" parameter: must be a non-empty string, received undefined'
    );
  });
});
