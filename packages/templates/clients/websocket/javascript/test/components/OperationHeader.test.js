import path from 'path';
import { render } from '@asyncapi/generator-react-sdk';
import { Parser, fromFile } from '@asyncapi/parser';
import OperationHeader from '../../components/OperationHeader';

const parser = new Parser();
const asyncapi_websocket_query = path.resolve(__dirname, '../../../../../../helpers/test/__fixtures__/asyncapi-websocket-query.yml');

describe('Testing of OperationHeader function', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_websocket_query).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  test('render operation header with summary and description correctly', () => {
    const operation = parsedAsyncAPIDocument.operations().get('mixedMessageExamples');
    const result = render(<OperationHeader operation={operation} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render operation header with summary only correctly', () => {
    const operation = parsedAsyncAPIDocument.operations().get('noMessage');
    
    const operationWithSummaryOnly = {
      ...operation,
      id: () => operation.id(),
      summary: () => operation.summary(),
      hasSummary: () => true,
      hasDescription: () => false,
      description: () => ''
    };
    
    const result = render(<OperationHeader operation={operationWithSummaryOnly} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render operation header with description only correctly', () => {
    const operation = parsedAsyncAPIDocument.operations().get('noMessageExamples');
    
    const operationWithDescriptionOnly = {
      ...operation,
      id: () => operation.id(),
      hasSummary: () => false,
      summary: () => '',
      hasDescription: () => true,
      description: () => 'This is a description without a summary'
    };
    
    const result = render(<OperationHeader operation={operationWithDescriptionOnly} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('render operation header with no summary or description correctly', () => {
    const operation = parsedAsyncAPIDocument.operations().get('noMessageExamples');
    
    const operationWithoutSummaryOrDescription = {
      ...operation,
      id: () => operation.id(),
      hasSummary: () => false,
      summary: () => '',
      hasDescription: () => false,
      description: () => ''
    };
    
    const result = render(<OperationHeader operation={operationWithoutSummaryOrDescription} />);
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });
});