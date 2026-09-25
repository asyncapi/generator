const path = require('path');
const { Parser, fromFile } = require('@asyncapi/parser');
const { getClientName, getInfo, getTitle, toSnakeCase, toCamelCase, lowerFirst, upperFirst, getSafeJSName } = require('@asyncapi/generator-helpers');

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

describe('toCamelCase integration test with AsyncAPI', () => {
  let parsedAsyncAPIDocument, ops;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
    ops = parsedAsyncAPIDocument.operations();
  });

  it('should convert snake_case operation names to camelCase format', () => {
    const operation = ops.get('operation_with_snake_case');
    const actualOperationId = toCamelCase(operation.id());
    const expectedOperationId = 'operationWithSnakeCase';
    expect(actualOperationId).toBe(expectedOperationId);
  });

  it('should leave already camelCase operation names unchanged', () => {
    const operation = ops.get('noSummaryNoDescriptionOperations');
    const actualOperationId = toCamelCase(operation.id());
    const expectedOperationId = 'noSummaryNoDescriptionOperations';
    expect(actualOperationId).toBe(expectedOperationId);
  });

  it('should convert PascalCase operation names to camelCase format', () => {
    const operation = ops.get('PascalCaseOperation');
    const actualOperationId = toCamelCase(operation.id());
    const expectedOperationId = 'pascalCaseOperation';
    expect(actualOperationId).toBe(expectedOperationId);
  });

  it('should return empty string when operation ID is empty', () => {
    const actualOperationId = toCamelCase('');
    const expectedOperationId = '';
    expect(actualOperationId).toBe(expectedOperationId);
  });
});

describe('lowerFirst', () => {
  let parsedAsyncAPIDocument, operations;

  beforeAll(async () => {
    const parseRes = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseRes.document;
    operations = parsedAsyncAPIDocument.operations();
  });

  it('should convert PascalCase operation names to lowerFirst format', () => {
    const operation = operations.get('PascalCaseOperation');
    const actualOperationId = lowerFirst(operation.id());
    const expectedOperationId = 'pascalCaseOperation';
    expect(actualOperationId).toBe(expectedOperationId);
  });

  it('should convert first letter to lowercase for PascalCase strings', () => {
    const actualResult = lowerFirst('HelloWorld');
    const expectedResult = 'helloWorld';
    expect(actualResult).toBe(expectedResult);
  });

  it('should return empty string when input is empty', () => {
    const actualResult = lowerFirst('A');
    const expectedResult = 'a';
    expect(actualResult).toBe(expectedResult);
  });
});

describe('upperFirst', () => {
  let parsedAsyncAPIDocument, operations;

  beforeAll(async () => {
    const parsedResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parsedResult.document;
    operations = parsedAsyncAPIDocument.operations();
  });

  it('should convert camelCase operation names to PascalCase format', () => {
    const operation = operations.get('noSummaryNoDescriptionOperations');
    const actualOperationId = upperFirst(operation.id());
    const expectedOperationId = 'NoSummaryNoDescriptionOperations';
    expect(actualOperationId).toBe(expectedOperationId);
  });

  it('should convert first letter to uppercase for camelCase strings', () => {
    const actualResult = upperFirst('helloWorld');
    const expectedResult = 'HelloWorld';
    expect(actualResult).toBe(expectedResult);
  });

  it('should handle single character strings', () => {
    const actualResult = upperFirst('a');
    const expectedResult = 'A';
    expect(actualResult).toBe(expectedResult);
  });
});

describe('getSafeJSName', () => {
  it('should convert hyphenated names to camelCase', () => {
    expect(getSafeJSName('my-param')).toBe('myParam');
    expect(getSafeJSName('some_other_param')).toBe('someOtherParam');
  });

  it('should prefix names starting with a digit with an underscore', () => {
    expect(getSafeJSName('1st')).toBe('_1st');
    expect(getSafeJSName('2nd-param')).toBe('_2ndParam');
  });

  it('should replace invalid JavaScript identifier characters', () => {
    const result = getSafeJSName('my@param!');
    expect(result).toMatch(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/);
  });

  it('should prefix JavaScript keywords detected by Babel', () => {
    expect(getSafeJSName('class')).toBe('_class');
    expect(getSafeJSName('return')).toBe('_return');
    expect(getSafeJSName('const')).toBe('_const');
    expect(getSafeJSName('import')).toBe('_import');
    expect(getSafeJSName('for')).toBe('_for');
  });

  it('should prefix strict-mode reserved words detected by Babel', () => {
    expect(getSafeJSName('true')).toBe('_true');
    expect(getSafeJSName('false')).toBe('_false');
    expect(getSafeJSName('null')).toBe('_null');
    expect(getSafeJSName('enum')).toBe('_enum');
    expect(getSafeJSName('implements')).toBe('_implements');
    expect(getSafeJSName('interface')).toBe('_interface');
    expect(getSafeJSName('let')).toBe('_let');
    expect(getSafeJSName('package')).toBe('_package');
    expect(getSafeJSName('private')).toBe('_private');
    expect(getSafeJSName('protected')).toBe('_protected');
    expect(getSafeJSName('public')).toBe('_public');
    expect(getSafeJSName('static')).toBe('_static');
    expect(getSafeJSName('yield')).toBe('_yield');
    expect(getSafeJSName('arguments')).toBe('_arguments');
    expect(getSafeJSName('eval')).toBe('_eval');
  });

  it('should not prefix non-reserved words that resemble reserved words', () => {
    expect(getSafeJSName('classic')).toBe('classic');
    expect(getSafeJSName('returning')).toBe('returning');
    expect(getSafeJSName('constant')).toBe('constant');
  });

  it('should prefix names that collide with caller-supplied reservedNames', () => {
    const reserved = new Set(['url', 'throwSendErrors', 'params', 'queryString']);
    expect(getSafeJSName('url', new Map(), reserved)).toBe('_url');
    expect(getSafeJSName('throwSendErrors', new Map(), reserved)).toBe('_throwSendErrors');
    expect(getSafeJSName('params', new Map(), reserved)).toBe('_params');
  });

  it('should not prefix names not in the reservedNames set', () => {
    const reserved = new Set(['url']);
    expect(getSafeJSName('urlValue', new Map(), reserved)).toBe('urlValue');
  });

  it('should throw when two different names produce the same identifier', () => {
    const usedNames = new Map();
    getSafeJSName('client-id', usedNames);
    expect(() => getSafeJSName('client_id', usedNames)).toThrow(
      'Cannot generate JavaScript client: query parameters "client-id" and "client_id" both produce "clientId".'
    );
  });

  it('should throw when the same name is registered twice', () => {
    const usedNames = new Map();
    getSafeJSName('token', usedNames);
    expect(() => getSafeJSName('token', usedNames)).toThrow(
      'Cannot generate JavaScript client: query parameters "token" and "token" both produce "token".'
    );
  });

  it('should throw when a name cannot produce a valid identifier', () => {
    expect(() => getSafeJSName('!@#$%')).toThrow(
      'Cannot generate JavaScript client: query parameter "!@#$%" cannot be converted to a valid JavaScript identifier.'
    );
  });

  it('should track used names in the shared Map across calls', () => {
    const usedNames = new Map();
    expect(getSafeJSName('token', usedNames)).toBe('token');
    expect(getSafeJSName('secret', usedNames)).toBe('secret');
    expect(usedNames.size).toBe(2);
    expect(usedNames.get('token')).toBe('token');
    expect(usedNames.get('secret')).toBe('secret');
  });
});