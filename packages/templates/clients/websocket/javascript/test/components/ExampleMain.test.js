import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ExampleMain } from '../../components/ExampleMain';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);

describe('ExampleMain component', () => {
  let sendOps;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    sendOps = parseResult.document.operations().filterBySend();
  });

  test('renders full body when hasSend=true', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="wsClient"
        sendOps={sendOps}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders skeleton body when hasSend=false', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="wsClient"
        sendOps={[]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
