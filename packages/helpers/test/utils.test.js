const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getClientName, getInfo } = require('@asyncapi/generator-helpers');

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, './__fixtures__/asyncapi-websocket-query.yml');

describe('getClientName integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should generate correct client name for the provided AsyncAPI info object without appendClientSuffix', () => {
    const appendClientSuffix = false;
    const customClientName = '';

    const clientName = getClientName(parsedAsyncAPIDocument, appendClientSuffix, customClientName);

    // Example assertion: Check if the name is formatted correctly
    expect(clientName).toBe('GeminiMarketDataWebsocketAPI');
  });

  it('should generate correct client name for the provided AsyncAPI info object with appendClientSuffix', () => {
    const appendClientSuffix = true;
    const customClientName = '';

    const clientName = getClientName(parsedAsyncAPIDocument, appendClientSuffix, customClientName);

    // Example assertion: Check if the name is formatted correctly
    expect(clientName).toBe('GeminiMarketDataWebsocketAPIClient');
  });

  it('should return customClientName', () => {
    const appendClientSuffix = false;
    const customClientName = 'GeminiClient';

    const clientName = getClientName(parsedAsyncAPIDocument, appendClientSuffix, customClientName);

    // Example assertion: Check if the name is formatted correctly
    expect(clientName).toBe(customClientName);
  });
});

describe('getInfo integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should return the exact info object when exists', () => {
    const expectedInfo = parsedAsyncAPIDocument.info();
    const actualInfo = getInfo(parsedAsyncAPIDocument);
    expect(actualInfo).toStrictEqual(expectedInfo);
  });

  it('should throw error when info method returns empty value', () => {
    const invalidAsyncAPIDocument = { info: () => {} };
    expect(() => getInfo(invalidAsyncAPIDocument)).toThrowError(
      'AsyncAPI document info object cannot be empty.'
    );
  });

  it('should throw error when info method is missing', () => {
    const invalidAsyncAPIDocument = {};
    expect(() => getInfo(invalidAsyncAPIDocument)).toThrowError(
      'Provided AsyncAPI document doesn\'t contain Info object.'
    );
  });

  it('should throw error when AsyncAPI document is missing', () => {
    expect(() => {
      getInfo(null);
    }).toThrow('Make sure you pass AsyncAPI document as an argument.');
  });
});

describe('getTitle integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
  });

  it('should return the exact title parameter when exists', () => {
    const info = parsedAsyncAPIDocument.info();
    const expectedTitle = info.title();
    const actualTitle = getTitle(parsedAsyncAPIDocument);
    expect(actualTitle).toStrictEqual(expectedTitle);
  });

  it('should throw error when title function does not exist', () => {
    const asyncAPIDocWithoutTitle = {
      info: () => ({
        // info object without title method
      })
    };
    expect(() => {
      getTitle(asyncAPIDocWithoutTitle);
    }).toThrow('Provided AsyncAPI document info field doesn\'t contain title.');
  });

  it('should throw error when title is an empty string', () => {
    const asyncAPIDocWithEmptyTitle = {
      info: () => ({
        title: () => ''
      })
    };

    expect(() => {
      getTitle(asyncAPIDocWithEmptyTitle);
    }).toThrow('AsyncAPI document title cannot be an empty string.');
  });
});

describe('toSnakeCase integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument, operations;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
    operations = parsedAsyncAPIDocument.operations();
  });

  it('should convert PascalCase operation names to snake_case format', () => {
    const operation = operations.get('PascalCaseOperation');
    const actualOperationId = toSnakeCase(operation.id());
    const expectedOperationId = 'pascal_case_operation';
    expect(actualOperationId).toBe(expectedOperationId);
  });

  it('should leave already snake_case operation names unchanged', () => {
    const operation = operations.get('operation_with_snake_case');
    const actualOperationId = toSnakeCase(operation.id());
    const expectedOperationId = 'operation_with_snake_case';
    expect(actualOperationId).toBe(expectedOperationId);
  });

  it('should convert camelCase operation names to snake_case format', () => {
    const operation = operations.get('noSummaryNoDescriptionOperations');
    const actualOperationId = toSnakeCase(operation.id());
    const expectedOperationId = 'no_summary_no_description_operations';
    expect(actualOperationId).toBe(expectedOperationId);
  });

  it('should return empty string', () => {
    const actualOperationId = toSnakeCase('');
    const expectedOperationId = '';
    expect(actualOperationId).toBe(expectedOperationId);
  });
});