import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ExampleSendInvocations } from '../../components/ExampleSendInvocations';

const parser = new Parser();
const asyncapiFilePath = path.resolve(
  __dirname,
  '../../../test/__fixtures__/asyncapi-hoppscotch-client.yml'
);

describe('ExampleSendInvocations component', () => {
  let sendOps;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    sendOps = parseResult.document.operations().filterBySend();
  });

  test('renders bounded for-loop with one send op (hoppscotch echo)', () => {
    const result = render(
      <ExampleSendInvocations instanceName="client" sendOps={sendOps} />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when sendOps is empty', () => {
    const result = render(
      <ExampleSendInvocations instanceName="client" sendOps={[]} />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('emits TODO placeholder when message has no examples', () => {
    // Why: A parser-shaped stand-in is needed because the protocol-shared
    // fixtures all have examples; no real spec expresses "send op with a
    // message that has no examples". Mirrors the Dart pattern at
    // packages/templates/clients/websocket/dart/test/components/ExampleSendInvocations.test.js:34-50.
    const fakeOp = {
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
      <ExampleSendInvocations instanceName="client" sendOps={[fakeOp]} />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
