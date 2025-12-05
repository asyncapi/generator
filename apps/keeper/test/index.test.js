import path from 'path';
import { Parser, fromFile } from '@asyncapi/parser';
import {
  compileSchema,
  compileSchemas,
  validateMessage,
  compileSchemasByOperationId
} from '../src/index.js';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../test/__fixtures__/asyncapi-message-validation.yml');

// Single helper function that can be used differently
async function parseAsyncAPIFile() {
  const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
  return parseResult.document;
}

describe('Integration Tests for message validation module', () => {
  describe('Schema Compilation & Basic Validation', () => {
    let compiledSchema;

    beforeAll(async () => {
      const parsedAsyncAPIDocument = await parseAsyncAPIFile();
      const firstSchema = parsedAsyncAPIDocument.schemas().all()[0].json();
      compiledSchema = compileSchema(firstSchema);
    });

    test('should validate a correct message against schema and return true', async () => {
      const validMessage = {
        content: 'This is a test message',
        messageId: 11
      };
      const result = validateMessage(compiledSchema, validMessage);
      expect(result.isValid).toBe(true);
      expect(result.validationErrors).toBeUndefined();
    });

    test('should return false for invalid message that does not match data type', async () => {
      const invalidMessage = {
        content: 42
      };
      const result = validateMessage(compiledSchema, invalidMessage);
      expect(result.isValid).toBe(false);
      expect(result.validationErrors.length).toBeGreaterThan(0);
    });

    test('should return false when message cannot match schema', async () => {
      const invalidMessage = 42;
      const result = validateMessage(compiledSchema, invalidMessage);
      expect(result.isValid).toBe(false);
      expect(result.validationErrors.length).toBeGreaterThan(0);
    });

    test('should return false when required field is missing', async () => {
      const invalidMessage = {
        messageId: 12
      };
      const result = validateMessage(compiledSchema, invalidMessage);
      expect(result.isValid).toBe(false);
      expect(result.validationErrors.length).toBeGreaterThan(0);
    });

    test('should throw error if message is undefined', () => {
      expect(() => validateMessage(compiledSchema, undefined)).toThrow('Invalid "message" parameter');
    });

    test('should throw error if compiledSchema is not a function', () => {
      expect(() => validateMessage({}, { content: 'test' })).toThrow('Invalid "compiledSchema" parameter');
    });
  });

  describe('compileSchemas utility function', () => {
    test('should compile multiple schemas successfully', async () => {
      const parsedAsyncAPIDocument = await parseAsyncAPIFile();
      const allSchemas = parsedAsyncAPIDocument.schemas().all();
      const rawSchemas = allSchemas.map(schema => schema.json());
      const compiledSchemas = compileSchemas(rawSchemas);

      expect(Array.isArray(compiledSchemas)).toBe(true);
      expect(compiledSchemas.length).toBe(rawSchemas.length);
      compiledSchemas.forEach(schema => {
        expect(typeof schema).toBe('function');
      });
    });

    test('should throw error if schemas parameter is not an array', () => {
      expect(() => compileSchemas({})).toThrow('Invalid "schemas" parameter');
    });
  });

  describe('Operation-Specific Validation', () => {
    let compiledSchemas;
    let compiledSchema;

    beforeAll(async () => {
      compiledSchemas = await compileSchemasByOperationId(asyncapi_v3_path, 'sendHelloMessage');
      compiledSchema = compiledSchemas[0];
    });

    test('should validate a correct message against operation schema and return true', async () => {
      const validMessage = {
        content: 'This is a operation test message'
      };
      const result = validateMessage(compiledSchema, validMessage);
      expect(result.isValid).toBe(true);
    });

    test('should return false for invalid message against operation schema', async () => {
      const invalidMessage = {
        messageId: 10
      };
      const result = validateMessage(compiledSchema, invalidMessage);
      expect(result.isValid).toBe(false);
      expect(result.validationErrors.length).toBeGreaterThan(0);
    });

    test('should throw error for invalid operationId', async () => {
      await expect(
        compileSchemasByOperationId(asyncapi_v3_path, 'nonExistentOperation')
      ).rejects.toThrow('Operation with ID "nonExistentOperation" not found');
    });

    test('should throw error for empty operationId', async () => {
      await expect(
        compileSchemasByOperationId(asyncapi_v3_path, '')
      ).rejects.toThrow('Invalid "operationId" parameter');
    });
  });
});