import path from 'path';
import { parseAsyncAPIDocumentFromFile } from '../src/utils.js';

const validFixturePath = path.resolve(__dirname, './__fixtures__/asyncapi-message-validation.yml');
const nonExistentPath = path.resolve(__dirname, './__fixtures__/non-existent-file.yml');

describe('parseAsyncAPIDocumentFromFile', () => {
  describe('Input validation', () => {
    test.each([
      ['undefined', undefined],
      ['null', null],
      ['number', 123],
      ['boolean', true],
      ['object', {}],
      ['array', []],
    ])('should throw error when asyncapiFilepath is %s', async (_, invalidPath) => {
      await expect(parseAsyncAPIDocumentFromFile(invalidPath)).rejects.toThrow(
        `Invalid "asyncapiFilepath" parameter: must be a non-empty string, received ${invalidPath}`
      );
    });

    test('should throw error when asyncapiFilepath is an empty string', async () => {
      await expect(parseAsyncAPIDocumentFromFile('')).rejects.toThrow(
        'Invalid "asyncapiFilepath" parameter: must be a non-empty string, received '
      );
    });

    test('should throw error when asyncapiFilepath contains only whitespace', async () => {
      await expect(parseAsyncAPIDocumentFromFile('   ')).rejects.toThrow(
        'Invalid "asyncapiFilepath" parameter: must be a non-empty string, received    '
      );
    });
  });

  describe('Error wrapping when parsing fails', () => {
    test('should throw wrapped error when file does not exist', async () => {
      await expect(parseAsyncAPIDocumentFromFile(nonExistentPath)).rejects.toThrow(
        /^Failed to parse AsyncAPI document:/
      );
    });
  });

  describe('Happy path', () => {
    test('should successfully parse valid AsyncAPI file and return document', async () => {
      const document = await parseAsyncAPIDocumentFromFile(validFixturePath);
      expect(document).toBeDefined();
      expect(document.info().title()).toBe('WebSocket Client');
    });
  });
});
