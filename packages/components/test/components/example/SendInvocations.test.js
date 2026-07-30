import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { SendInvocations } from '../../../src/index';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of SendInvocations function', () => {
  let sendOps;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    sendOps = parseResult.document.operations().filterBySend();
  });

  const languages = ['javascript', 'python', 'dart'];

  it.each(languages)('render %s send loop with real operations', (language) => {
    const result = render(
      <SendInvocations
        language={language}
        instanceName="echoClient"
        sendOps={sendOps}
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  it.each(languages)('returns null for %s when sendOps is empty', (language) => {
    const result = render(
      <SendInvocations language={language} instanceName="echoClient" sendOps={[]} />
    );
    expect(result.trim()).toBe('');
  });

  it.each(languages)('returns null for %s when sendOps is undefined', (language) => {
    const result = render(
      <SendInvocations language={language} instanceName="echoClient" />
    );
    expect(result.trim()).toBe('');
  });

  test('throws when language is unsupported', () => {
    expect(() => render(
      <SendInvocations language="ruby" instanceName="echoClient" sendOps={sendOps} />
    )).toThrow(/Unsupported language "ruby"\. Supported languages:/);
  });
});
