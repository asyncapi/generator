import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { ServiceRequires } from '../../components/ServiceRequires';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../../clients/websocket/test/__fixtures__/asyncapi-websocket-components.yml');

describe('ServiceRequires component', () => {
  let channels;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    channels = parseResult.document.channels().all();
  });

  test('requires the handlers of every operation from the service file of the channel', () => {
    const result = render(<ServiceRequires channels={channels} />);

    expect(result).toBe('const { sendMessage, sendNotification, receiveMessage, receiveNotification } = require(\'./services/test-channel\');\n');
  });

  test('renders nothing without channels', () => {
    const result = render(<ServiceRequires channels={[]} />);

    expect(result).toBe('');
  });
});
