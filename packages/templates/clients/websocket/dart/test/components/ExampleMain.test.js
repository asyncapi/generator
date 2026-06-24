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

  test('renders both branch: hasSend=true, hasReceive=true', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="hoppscotchClient"
        sendOps={sendOps}
        hasReceive={true}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders send-only branch: hasSend=true, hasReceive=false', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="hoppscotchClient"
        sendOps={sendOps}
        hasReceive={false}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders receive-only branch: hasSend=false, hasReceive=true', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="hoppscotchClient"
        sendOps={[]}
        hasReceive={true}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders none branch: hasSend=false, hasReceive=false', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchClient"
        instanceName="hoppscotchClient"
        sendOps={[]}
        hasReceive={false}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
