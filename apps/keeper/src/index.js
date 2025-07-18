import { registerSchema, validate, unregisterSchema } from '@hyperjump/json-schema/draft-07';
import { Parser, fromFile } from '@asyncapi/parser';

const parser = new Parser();

/**
* Validates a message payload against an array of operation message schemas.
* This method uses the Hyperjump JSON Schema validator (Draft-07) to check if
* the given message object conforms to at least one of the provided operation-level
* message schemas (as defined in the AsyncAPI document).
* @async
* @param {Object} message - The message payload to be validated.
* @param {Array<Object>} schemas - An array of JSON Schema objects representing operation message schemas.
* @returns {Promise<boolean>} - Resolves to true if the message is valid against any of the schemas, otherwise false.
*/
export async function validateMessage(message, schemas) {
  if (!Array.isArray(schemas)) {
    throw new Error(`Invalid "schemas" parameter: expected an array of JSON Schemas, but got ${typeof schemas}`);
  }
  if (!schemas || schemas.length === 0) {
    throw new Error('Empty "schemas" array: at least one JSON Schema must be provided for validation.');
  }
  if (message === null || message === undefined) {
    throw new Error(`Invalid "message" parameter: expected a non-null object to validate, but received ${message}`);
  }

  const dialectId = 'http://json-schema.org/draft-07/schema#';
  const schemaIds = [];

  try {
    // Register all schemas first
    for (let index = 0; index < schemas.length; index++) {
      const schemaId = `http://example.com/schema-${index}`;
      registerSchema(schemas[index], schemaId, dialectId);
      schemaIds.push(schemaId);
    }
    // Validate against each schema until first match
    for (const schemaId of schemaIds) {
      const result = await validate(schemaId, message);
      if (result.valid) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Schema validation failed:', error);
    return false;
  } finally {
    // Clean up all registered schemas
    for (const schemaId of schemaIds) {
      try {
        unregisterSchema(schemaId);
      } catch (cleanupError) {
        console.error(`Failed to unregister schema ${schemaId}:`, cleanupError);
      }
    }
  }
}

/**
 * Validates a message payload against the schemas defined for a specific operation in an AsyncAPI document.
 * 
 * @async
 * @param {string} asyncapiFilepath - Path to the AsyncAPI document file.
 * @param {string} operationId - The operation ID to validate against.
 * @param {Object} message - The message payload to validate.
 * @returns {Promise<boolean>} - Resolves to true if the message is valid against any of the operation's message schemas.
 * @throws {Error} If the AsyncAPI document cannot be parsed, the operation is not found, or no message schemas exist.
 * 
 */
export async function validateByOperationId(asyncapiFilepath, operationId, message) {
  if (typeof asyncapiFilepath !== 'string' || !asyncapiFilepath.trim()) {
    throw new Error(`Invalid "asyncapiFilepath" parameter: must be a non-empty string, received ${asyncapiFilepath}`);
  }
  if (typeof operationId !== 'string' || !operationId.trim()) {
    throw new Error(`Invalid "operationId" parameter: must be a non-empty string, received ${operationId}`);
  }
  if (message === null || message === undefined) {
    throw new Error(`Invalid "message" parameter: expected a non-null object to validate, but received ${message}`);
  }

  let asyncapi;
  try {
    const parseResult = await fromFile(parser, asyncapiFilepath).parse();
    asyncapi = parseResult.document;
  } catch (error) {
    throw new Error(`Failed to parse AsyncAPI document: ${error.message}`);
  }

  const operation = asyncapi.operations().get(operationId);
  const messages = operation.messages().all();
  const messagePayloads = messages.map((message) => message.payload());
  const schemas = messagePayloads.map(payload => payload.json());

  return validateMessage(message, schemas);
}