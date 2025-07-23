import path from 'path';
import { Parser, fromFile } from '@asyncapi/parser';
import { compileSchemas, validateMessage, validateByOperationId, compileSchemasByOperationId } from '../src/index.js';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../test/__fixtures__/asyncapi-message-validation.yml');

// describe('Integration Tests for validateMessage function', () => {
//   let compiledSchemas;
//   let rawSchemas;

//   beforeAll(async () => {
//     const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
//     const parsedAsyncAPIDocument = parseResult.document;
//     rawSchemas = parsedAsyncAPIDocument.schemas().all().map(schema => schema.json());
//     compiledSchemas = await compileSchemas(rawSchemas);
//   });

//   test('should validate a correct message against schemas and return true', async () => {
//     const validMessage = {
//       content: 'This is a test message',
//       timestamp: new Date().toISOString()
//     };
//     const result = await validateMessage(compiledSchemas, validMessage);
//     expect(result).toBe(true);
//   });

//   test('should return false for invalid message that does not match data type', async () => {
//     const invalidMessage = {
//       content: 42  
//     };
//     const result = await validateMessage(compiledSchemas, invalidMessage);
//     expect(result).toBe(false);
//   });

//   test('should return false when message cannot match any schema', async () => {
//     const invalidMessage = 42; 
//     const result = await validateMessage(compiledSchemas, invalidMessage);
//     expect(result).toBe(false);
//   });

//   test('should return false when required field is missing', async () => {
//     const invalidMessage = {
//       timestamp: new Date().toISOString() 
//     };
//     const result = await validateMessage(compiledSchemas, invalidMessage);
//     expect(result).toBe(false);
//   });

//   test('should throw error if message is null', async () => {
//     await expect(validateMessage(compiledSchemas, null)).rejects.toThrow('Invalid "message" parameter');
//   });

//   test('should throw error if message is undefined', async () => {
//     await expect(validateMessage(compiledSchemas, undefined)).rejects.toThrow('Invalid "message" parameter');
//   });
// });

describe('Integration Tests for validateByOperationId function', () => {
  let compiledSchemas;

  beforeAll(async () => {
    compiledSchemas = await compileSchemasByOperationId(asyncapi_v3_path, 'sendHelloMessage');
  });

  test('should validate a correct message against operation schemas and return true', async () => {
    const validMessage = {
      content: 'This is a test message',
      timestamp: new Date().toISOString()
    };
    const result = await validateByOperationId(compiledSchemas, validMessage);
    expect(result).toBe(true);
  });

  test('should return false for invalid message against operation schemas', async () => {
    const invalidMessage = {
      timestamp: new Date().toISOString() 
    };
    const result = await validateByOperationId(compiledSchemas, invalidMessage);
    expect(result).toBe(false);
  });
});