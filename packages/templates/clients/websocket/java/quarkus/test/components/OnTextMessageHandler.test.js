import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import OnTextMessageHandler from '../../components/OnTextMessageHandler.js';

const parser = new Parser();
const asyncapiFilePath = path.resolve(__dirname, '../__fixtures__/asyncapi-java-quarkus-tests.yml');

describe('OnTextMessageHandler component (integration with AsyncAPI document)', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapiFilePath).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('renders default handler when sendOperations is null', () => {
    const result = render(<OnTextMessageHandler sendOperations={null} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders default handler when sendOperations is empty array', () => {
    const result = render(<OnTextMessageHandler sendOperations={[]} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders default handler without sendOperations', () => {
    const result = render(<OnTextMessageHandler />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders handler with if statement for single send operation', () => {
    const operations = parsedAsyncAPIDocument.operations();
    const allSendOps = operations.filterBySend();
    const sendOpsArray = Array.from(allSendOps);
    const singleOperation = [sendOpsArray[0]];    
    const result = render(<OnTextMessageHandler sendOperations={singleOperation} />);
    expect(result.trim()).toMatchSnapshot();
  });

  test('renders handler with if-else-if chain for multiple send operations', () => {
    const operations = parsedAsyncAPIDocument.operations();
    const sendOperations = operations.filterBySend();    
    const result = render(<OnTextMessageHandler sendOperations={sendOperations} />);
    expect(result.trim()).toMatchSnapshot();
  });
});