import path from 'path';
import { Parser, fromFile } from '@asyncapi/parser';
import {
  compileSchemas,
  validateMessage,
  compileSchemasByOperationId,
  removeCompiledSchemas
} from '../src/index.js';

const parser = new Parser();
const asyncapi_v3_path = path.resolve(__dirname, '../test/__fixtures__/asyncapi-message-validation.yml');

describe('Integration Tests for message validation module', () => {
  // Cleanup: Remove all compiled schemas from the local registry after all tests complete
  afterAll(() => {
    removeCompiledSchemas();
  });

  describe('Schema Compilation & Basic Validation', () => {
    let compiledSchemas;
    let rawSchemas;

    beforeAll(async () => {
      const parseResult = await fromFile(parser, asyncapi_v3_path).parse();
      const parsedAsyncAPIDocument = parseResult.document;
      rawSchemas = parsedAsyncAPIDocument.schemas().all().map(schema => schema.json());
      compiledSchemas = await compileSchemas(rawSchemas);
    });

    test('should validate a correct message against schemas and return true', async () => {
      const validMessage = {
        content: 'This is a test message',
        timestamp: new Date().toISOString()
      };
      const result = validateMessage(compiledSchemas, validMessage);
      expect(result).toBe(true);
    });

    test('should return false for invalid message that does not match data type', async () => {
      const invalidMessage = {
        content: 42
      };
      const result = validateMessage(compiledSchemas, invalidMessage);
      expect(result).toBe(false);
    });

    test('should return false when message cannot match any schema', async () => {
      const invalidMessage = 42;
      const result = validateMessage(compiledSchemas, invalidMessage);
      expect(result).toBe(false);
    });

    test('should return false when required field is missing', async () => {
      const invalidMessage = {
        timestamp: new Date().toISOString()
      };
      const result = validateMessage(compiledSchemas, invalidMessage);
      expect(result).toBe(false);
    });

    test('should throw error if message is null', () => {
      expect(() => validateMessage(compiledSchemas, null)).toThrow('Invalid "message" parameter');
    });

    test('should throw error if message is undefined', () => {
      expect(() => validateMessage(compiledSchemas, undefined)).toThrow('Invalid "message" parameter');
    });
  });

  describe('Operation-Specific Validation', () => {
    let compiledSchemas;

    beforeAll(async () => {
      compiledSchemas = await compileSchemasByOperationId(asyncapi_v3_path, 'sendHelloMessage');
    });

    test('should validate a correct message against operation schemas and return true', async () => {
      const validMessage = {
        content: 'This is a operation test message'
      };
      const result = validateMessage(compiledSchemas, validMessage);
      expect(result).toBe(true);
    });

    test('should return false for invalid message against operation schemas', async () => {
      const invalidMessage = {
        time: new Date().toISOString()
      };
      const result = validateMessage(compiledSchemas, invalidMessage);
      expect(result).toBe(false);
    });
  });
});