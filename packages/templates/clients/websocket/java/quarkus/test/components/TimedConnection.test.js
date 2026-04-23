import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import TimedConnection from '../../components/TimedConnection.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../../../../test/__fixtures__/asyncapi-websocket-components.yml');

describe('TimedConnection component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;
  let sendOperations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
    const operations = parsedAsyncAPIDocument.operations();
    sendOperations = operations.filterBySend();
  });

  test('renders generic message when sendOperations is null', () => {
    const result = render(
      <TimedConnection 
        sendOperations={null} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders generic message when sendOperations is undefined', () => {
    const result = render(
      <TimedConnection />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders generic message when sendOperations is empty array', () => {
    const result = render(
      <TimedConnection 
        sendOperations={[]} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders specific message with operationId when sendOperations has data from fixture', () => {
    const result = render(
      <TimedConnection 
        sendOperations={sendOperations} 
      />
    );
    expect(result.trim()).toMatchSnapshot();
  });
});