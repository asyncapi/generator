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
      <ExampleSendInvocations instanceName="hoppscotchClient" sendOps={sendOps} />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders nothing when sendOps is empty', () => {
    const result = render(
      <ExampleSendInvocations instanceName="hoppscotchClient" sendOps={[]} />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('elides extra ops when sendOps length exceeds maxOpsToList', () => {
    const fakeOps = Array.from({ length: 7 }, (_, i) => ({
      id: () => `sendOp${i}`,
      messages: () => ({ isEmpty: () => true })
    }));
    const result = render(
      <ExampleSendInvocations
        instanceName="myClient"
        sendOps={fakeOps}
        maxOpsToList={3}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('emits TODO placeholder when message has no examples', () => {
    const fakeOp = {
      id: () => 'sendStuff',
      messages: () => ({
        isEmpty: () => false,
        all: () => [
          {
            name: () => 'StuffPayload',
            examples: () => ({ isEmpty: () => true })
          }
        ]
      })
    };
    const result = render(
      <ExampleSendInvocations instanceName="myClient" sendOps={[fakeOp]} />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});
