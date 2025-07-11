import path from 'path';
import { Parser, fromFile } from '@asyncapi/parser';
import { validateMessage } from '../src/index.js';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../test/__fixtures__/asyncapi-message-validation.yml');

describe('Integration Tests for validateMessage function', () => {
  let parsedAsyncAPIDocument;
  let schemas;

  beforeAll(async () => {
    const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
    parsedAsyncAPIDocument = parseResult.document;
    schemas = parsedAsyncAPIDocument.schemas().all();
  });

  test('should validate a correct message against schemas and return true', async () => {
    const jsonSchemas = schemas.map(schema => schema.json());
    const validMessage = {
      content: 'This is a test message',
      timestamp: new Date().toISOString()
    };
    const result = await validateMessage(validMessage, jsonSchemas);
    expect(result).toBe(true);
  });

  test('should return false for invalid message that does not match data type', async () => {
    const jsonSchemas = schemas.map(schema => schema.json());
    const invalidMessage = {
      content: 42
    };
    const result = await validateMessage(invalidMessage, jsonSchemas);
    expect(result).toBe(false);
  });

  test('should return false when message contains fields not defined in the schema', async () => {
    const jsonSchemas = schemas.map(schema => schema.json());
    const invalidMessage = {
      unknownField: 42
    };
    const result = await validateMessage(invalidMessage, jsonSchemas);
    expect(result).toBe(false);
  });

  test('should return false when message cannot match any schema', async () => {
    const jsonSchemas = schemas.map(schema => schema.json());
    const invalidMessage = 42;
    const result = await validateMessage(invalidMessage, jsonSchemas);
    expect(result).toBe(false);
  });

  test('should return false when required field defined in the schema is missing from the message', async () => {
    const jsonSchemas = schemas.map(schema => schema.json());
    const invalidMessage = {
      timestamp: new Date().toISOString()
    };
    const result = await validateMessage(invalidMessage, jsonSchemas);
    expect(result).toBe(false);
  });

  test('should throw error if schemas parameter is not an array', async () => {
    const validMessage = { content: 'test' };
    await expect(validateMessage(validMessage, {})).rejects.toThrow('Invalid "schemas" parameter');
  });

  test('should throw error if schemas array is empty', async () => {
    const validMessage = { content: 'test' };
    await expect(validateMessage(validMessage, [])).rejects.toThrow('Empty "schemas" array: at least one JSON Schema must be provided for validation.');
  });

  test('should throw error if message is null', async () => {
    const jsonSchemas = schemas.map(schema => schema.json());
    await expect(validateMessage(null, jsonSchemas)).rejects.toThrow('Invalid "message" parameter');
  });

  test('should throw error if message is undefined', async () => {
    const jsonSchemas = schemas.map(schema => schema.json());
    await expect(validateMessage(undefined, jsonSchemas)).rejects.toThrow('Invalid "message" parameter');
  });

  test('should throw error if jsonSchemas is undefined', async () => {
    const validMessage = { content: 'test' };
    await expect(validateMessage(validMessage, undefined)).rejects.toThrow('Invalid "schemas" parameter');
  });
});
