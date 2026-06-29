import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Example } from '../../components/Example';

const parser = new Parser();
const hoppscotchPath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);
const slackPath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-slack-client.yml'
);
const postmanPath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-postman-echo.yml'
);

const CLIENT_FILE_NAME = 'client.py';

describe('Example composer (end-to-end)', () => {
  let hoppAsyncapi;
  let slackAsyncapi;
  let postmanAsyncapi;

  beforeAll(async () => {
    hoppAsyncapi = (await fromFile(parser, hoppscotchPath).parse()).document;
    slackAsyncapi = (await fromFile(parser, slackPath).parse()).document;
    postmanAsyncapi = (await fromFile(parser, postmanPath).parse()).document;
  });

  test('renders full example.py for hoppscotch (send+receive) with default params', () => {
    const result = render(
      <Example
        asyncapi={hoppAsyncapi}
        params={{ clientFileName: CLIENT_FILE_NAME }}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('honors customClientName param', () => {
    const result = render(
      <Example
        asyncapi={hoppAsyncapi}
        params={{
          clientFileName: CLIENT_FILE_NAME,
          customClientName: 'MyEchoClient',
        }}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders receive-only example.py for slack (no send loop, with keep-alive)', () => {
    const result = render(
      <Example
        asyncapi={slackAsyncapi}
        params={{ clientFileName: CLIENT_FILE_NAME }}
      />
    );
    expect(result).not.toMatch(/for i in range\(/);
    expect(result).toMatch(/time\.sleep\(30\)/);
    expect(result).toMatch(/client\.register_on_hello_message_handler\(handle_on_hello_message\)/);
    expect(result.trim()).toMatchSnapshot();
  });

  test('registers outgoing processor when send op present (postman, appendClientSuffix)', () => {
    const result = render(
      <Example
        asyncapi={postmanAsyncapi}
        params={{
          clientFileName: CLIENT_FILE_NAME,
          appendClientSuffix: true,
        }}
      />
    );
    expect(result).toMatch(/\.register_outgoing_processor\(outgoing_message_processor\)/);
    expect(result.trim()).toMatchSnapshot();
  });
});
