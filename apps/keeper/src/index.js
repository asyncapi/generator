import { registerSchema, validate } from '@hyperjump/json-schema/draft-07';
import { Parser, fromFile } from '@asyncapi/parser';

const parser = new Parser();

/**
 * Compiles multiple JSON Schemas for validation.
 * @async
 * @param {Array<Object>} schemas - Array of JSON Schema objects to compile
 * @returns {Promise<Array<Function>>} Array of compiled schema validator functions
 */
export async function compileSchemas(schemas) {
  const dialectId = 'http://json-schema.org/draft-07/schema#';
  const schemaIds = [];
  const compiledSchemas = [];

  // Register all schemas first
  for (let index = 0; index < schemas.length; index++) {
    const schemaId = `http://example.com/schema-${index}`;
    registerSchema(schemas[index], schemaId, dialectId);
    schemaIds.push(schemaId);
  }

  for (const schemaId of schemaIds) {
    const compile_schema = await validate(schemaId);
    compiledSchemas.push(compile_schema);
  }

  return compiledSchemas;
}

/**
 * Compiles message schemas from an AsyncAPI document for a specific operation.
 * @async
 * @param {string} asyncapiFilepath - Path to the AsyncAPI document file
 * @param {string} operationId - ID of the operation to extract message schemas from
 * @returns {Promise<Array<Function>>} Array of compiled schema validator functions
 * @throws {Error} If filepath or operationId are invalid, or if parsing fails
 */
export async function compileSchemasByOperationId(asyncapiFilepath, operationId) {
  if (typeof asyncapiFilepath !== 'string' || !asyncapiFilepath.trim()) {
    throw new Error(`Invalid "asyncapiFilepath" parameter: must be a non-empty string, received ${asyncapiFilepath}`);
  }
  if (typeof operationId !== 'string' || !operationId.trim()) {
    throw new Error(`Invalid "operationId" parameter: must be a non-empty string, received ${operationId}`);
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
  // const id = schemas.map(sch => sch.id);
  // console.log(id);
  // console.log(schemas);
  return compileSchemas(schemas);
}

/**
 * Validates a message payload against an array of operation message schemas.
 * Uses the Hyperjump JSON Schema validator (Draft-07) to check if the message
 * conforms to at least one of the provided schemas.
 * @async
 * @param {Array<Function>} compiledSchemas - Array of compiled schema validator functions
 * @param {Object} message - The message payload to validate
 * @returns {Promise<boolean>} True if valid against any schema, false otherwise
 * @throws {Error} If message parameter is null or undefined
 */
export async function validateMessage(compiledSchemas, message) {
  if (!compiledSchemas || compiledSchemas.length === 0) {
    console.log('Skipping validation: no schemas provided for message validation.');
    return true;
  }
  if (message === null || message === undefined) {
    throw new Error(`Invalid "message" parameter: expected a non-null object to validate, but received ${message}`);
  }

  for (const compiledSchema of compiledSchemas) {
    const result = compiledSchema(message);
    if (result.valid) {
      return true;
    }
  }
  return false;
}

/**
 * Validates a message against compiled schemas (alias for validateMessage).
 * @async
 * @param {Array<Function>} compiledSchemas - Array of compiled schema validator functions
 * @param {Object} message - The message payload to validate
 * @returns {Promise<boolean>} True if valid against any schema, false otherwise
 * @see validateMessage
 */
export async function validateByOperationId(compiledSchemas, message) {
  return validateMessage(compiledSchemas, message);
}
