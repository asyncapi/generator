const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getOperationMessages } = require('@asyncapi/generator-helpers');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

describe('getOperationMessages integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument, operations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
    operations = parsedAsyncAPIDocument.operations();
  });

  it('should return all messages of an operation when operation exists', () => {
    const operation = operations.get('multipleExamples');
    const expectedOperationMessages = operation.messages().all();
    const actualOperationMessages = getOperationMessages(operation);
    expect(actualOperationMessages).toStrictEqual(expectedOperationMessages);
  });

  it('should return null when no messages present in an operations', () => {
    const operation = operations.get('noMessage');
    const actualOperationMessages = getOperationMessages(operation);
    expect(actualOperationMessages).toBeNull();
  });

  it('should throw error when operation is null', () => {
    expect(() => getOperationMessages(null)).toThrow('Operation object must be provided.');
  });

  it('should throw error when operation is undefined', () => {
    expect(() => getOperationMessages(undefined)).toThrow('Operation object must be provided.');
  });
});

