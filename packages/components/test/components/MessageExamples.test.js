import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import { MessageExamples } from '../../src/components/readme/MessageExamples';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing MessageExamples component', () => {
  let parsedAsyncAPIDocument, operations;
  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
    operations = parsedAsyncAPIDocument.operations();
  });

  test('Test operation with no messages', () => {
    const operation = operations.get('noMessage');
    const result = render(<MessageExamples operation={operation} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  test('Test operation with no message examples', () => {
    const operation = operations.get('noMessageExamples');
    const result = render(<MessageExamples operation={operation} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  test('Test operation with one example', () => {
    const operation = operations.get('oneMessageExample');
    const result = render(<MessageExamples operation={operation} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  test('Test operation with multiple examples', () => {
    const operation = operations.get('multipleExamples');
    const result = render(<MessageExamples operation={operation} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
  test('Test operation with multiple messages and multiple examples', () => {
    const operation = operations.get('mixedMessageExamples');
    const result = render(<MessageExamples operation={operation} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws error when operation is null', () => {
    expect(() =>
      render(<MessageExamples operation={null} />)
    ).toThrow(/Invalid AsyncAPI operation. Expected a valid operation with id()./);
  });
});
