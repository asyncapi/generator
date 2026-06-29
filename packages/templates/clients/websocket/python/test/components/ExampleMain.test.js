import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ExampleMain } from '../../components/ExampleMain';

const parser = new Parser();
const hoppscotchPath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);
const slackPath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-slack-client.yml'
);

describe('ExampleMain component', () => {
  let hoppSendOps;
  let hoppReceiveOps;
  let slackReceiveOps;

  beforeAll(async () => {
    const hopp = await fromFile(parser, hoppscotchPath).parse();
    hoppSendOps = hopp.document.operations().filterBySend();
    hoppReceiveOps = hopp.document.operations().filterByReceive();
    const slack = await fromFile(parser, slackPath).parse();
    slackReceiveOps = slack.document.operations().filterByReceive();
  });

  test('renders send+receive body (hoppscotch)', () => {
    const result = render(
      <ExampleMain
        clientName="HoppscotchEchoWebSocketClient"
        instanceName="client"
        sendOps={hoppSendOps}
        receiveOps={hoppReceiveOps}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders receive-only body (slack)', () => {
    const result = render(
      <ExampleMain
        clientName="SlackWebsocketAPIClient"
        instanceName="client"
        sendOps={[]}
        receiveOps={slackReceiveOps}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders send-only body (parser-shaped stand-in)', () => {
    // Why: No fixture expresses a send-only WebSocket spec; stand-in
    // mirrors the Dart pattern at
    // packages/templates/clients/websocket/dart/test/components/ExampleSendInvocations.test.js:34-50.
    const fakeSendOp = {
      id: () => 'sendStuff',
      messages: () => ({
        isEmpty: () => false,
        all: () => [
          {
            name: () => 'StuffPayload',
            examples: () => ({ isEmpty: () => true }),
          },
        ],
      }),
    };
    const result = render(
      <ExampleMain
        clientName="StuffClient"
        instanceName="client"
        sendOps={[fakeSendOp]}
        receiveOps={[]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders minimal body when spec has no send or receive ops', () => {
    const result = render(
      <ExampleMain
        clientName="EmptyClient"
        instanceName="client"
        sendOps={[]}
        receiveOps={[]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
