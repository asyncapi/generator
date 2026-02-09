import path from 'path';
import { parseAsyncAPIDocumentFromFile } from '../src/utils.js';

const validAsyncapiPath = path.resolve(__dirname, './__fixtures__/asyncapi-message-validation.yml');
const invalidAsyncapiPath = path.resolve(__dirname, './__fixtures__/non-existent-file.yml');

describe('parseAsyncAPIDocumentFromFile', () => {
    describe('Input Validation', () => {
        test('should throw error if asyncapiFilepath is null', async () => {
            await expect(parseAsyncAPIDocumentFromFile(null)).rejects.toThrow(
                'Invalid "asyncapiFilepath" parameter: must be a non-empty string'
            );
        });

        test('should throw error if asyncapiFilepath is undefined', async () => {
            await expect(parseAsyncAPIDocumentFromFile(undefined)).rejects.toThrow(
                'Invalid "asyncapiFilepath" parameter: must be a non-empty string'
            );
        });

        test('should throw error if asyncapiFilepath is empty string', async () => {
            await expect(parseAsyncAPIDocumentFromFile('')).rejects.toThrow(
                'Invalid "asyncapiFilepath" parameter: must be a non-empty string'
            );
        });

        test('should throw error if asyncapiFilepath is whitespace only', async () => {
            await expect(parseAsyncAPIDocumentFromFile('   ')).rejects.toThrow(
                'Invalid "asyncapiFilepath" parameter: must be a non-empty string'
            );
        });

        test('should throw error if asyncapiFilepath is a number', async () => {
            await expect(parseAsyncAPIDocumentFromFile(123)).rejects.toThrow(
                'Invalid "asyncapiFilepath" parameter: must be a non-empty string'
            );
        });

        test('should throw error if asyncapiFilepath is an object', async () => {
            await expect(parseAsyncAPIDocumentFromFile({ path: 'test.yml' })).rejects.toThrow(
                'Invalid "asyncapiFilepath" parameter: must be a non-empty string'
            );
        });

        test('should throw error if asyncapiFilepath is an array', async () => {
            await expect(parseAsyncAPIDocumentFromFile(['test.yml'])).rejects.toThrow(
                'Invalid "asyncapiFilepath" parameter: must be a non-empty string'
            );
        });
    });

    describe('Error Wrapping', () => {
        test('should wrap parser errors with "Failed to parse AsyncAPI document" message', async () => {
            await expect(parseAsyncAPIDocumentFromFile(invalidAsyncapiPath)).rejects.toThrow(
                /Failed to parse AsyncAPI document/
            );
        });

        test('should include file-related error details in wrapped message', async () => {
            try {
                await parseAsyncAPIDocumentFromFile(invalidAsyncapiPath);
                fail('Expected parseAsyncAPIDocumentFromFile to throw');
            } catch (error) {
                expect(error.message).toContain('Failed to parse AsyncAPI document');
            }
        });
    });

    describe('Happy Path', () => {
        test('should return parsed document for valid file path', async () => {
            const document = await parseAsyncAPIDocumentFromFile(validAsyncapiPath);
            expect(document).toBeDefined();
            expect(document.info()).toBeDefined();
            expect(document.info().title()).toBe('WebSocket Client');
        });

        test('should return document with correct version', async () => {
            const document = await parseAsyncAPIDocumentFromFile(validAsyncapiPath);
            expect(document.version()).toBe('3.0.0');
        });

        test('should return document with channels', async () => {
            const document = await parseAsyncAPIDocumentFromFile(validAsyncapiPath);
            const channels = document.channels();
            expect(channels).toBeDefined();
            expect(channels.all().length).toBeGreaterThan(0);
        });
    });
});
