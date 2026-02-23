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
});
