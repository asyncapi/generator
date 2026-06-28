import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Example } from '../../components/Example';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);
const postmanAsyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-postman-echo.yml'
);

const CLIENT_FILE_NAME = 'client.dart';

describe('Example composer (end-to-end)', () => {
  let asyncapi;
  let postmanAsyncapi;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    asyncapi = parseResult.document;
    const postmanResult = await fromFile(parser, postmanAsyncapiFilePath).parse();
    postmanAsyncapi = postmanResult.document;
  });

  test('renders full example.dart for hoppscotch (send+receive) with default params', () => {
    const result = render(
      <Example
        asyncapi={asyncapi}
        params={{ clientFileName: CLIENT_FILE_NAME }}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('honors customClientName param', () => {
    const result = render(
      <Example
        asyncapi={asyncapi}
        params={{
          clientFileName: CLIENT_FILE_NAME,
          customClientName: 'MyEchoClient',
        }}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('honors appendClientSuffix param', () => {
    const result = render(
      <Example
        asyncapi={asyncapi}
        params={{
          clientFileName: CLIENT_FILE_NAME,
          appendClientSuffix: true,
        }}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('registers message handler for send op with reply (postman echo)', () => {
    const result = render(
      <Example
        asyncapi={postmanAsyncapi}
        params={{
          clientFileName: CLIENT_FILE_NAME,
          appendClientSuffix: true,
        }}
      />
    );
    expect(result).toMatch(/\.registerMessageHandler\(myMessageHandler\);/);
    expect(result.trim()).toMatchSnapshot();
  });
});
