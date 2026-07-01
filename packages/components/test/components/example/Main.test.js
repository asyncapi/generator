import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { Main } from '../../../src/index';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of Main function', () => {
  let sendOps;
  let receiveOps;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    const operations = parseResult.document.operations();
    sendOps = operations.filterBySend();
    receiveOps = operations.filterByReceive();
  });

  test('render javascript main with send operations', () => {
    const result = render(
      <Main
        language="javascript"
        clientName="EchoClient"
        instanceName="echoClient"
        sendOps={sendOps}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('render javascript main with no send operations', () => {
    const result = render(
      <Main
        language="javascript"
        clientName="EchoClient"
        instanceName="echoClient"
        sendOps={[]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('render python main with send and receive operations', () => {
    const result = render(
      <Main
        language="python"
        clientName="EchoClient"
        instanceName="echo_client"
        sendOps={sendOps}
        receiveOps={receiveOps}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('render python main with no send and no receive operations', () => {
    const result = render(
      <Main
        language="python"
        clientName="EchoClient"
        instanceName="echo_client"
        sendOps={[]}
        receiveOps={[]}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('render dart main with send operations', () => {
    const result = render(
      <Main
        language="dart"
        clientName="EchoClient"
        instanceName="echoClient"
        sendOps={sendOps}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('throws when language is unsupported', () => {
    expect(() => render(
      <Main language="ruby" clientName="X" instanceName="x" sendOps={[]} />
    )).toThrow(/Unsupported language "ruby"\. Supported languages:/);
  });
});
