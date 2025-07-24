import { getAllRegisteredSchemaUris, registerSchema, unregisterSchema, validate } from '@hyperjump/json-schema/draft-07';
import { generateSchemaURI, parseAsyncAPIDocumentFromFile } from './utils';

/**
 * Compiles multiple JSON Schemas for validation.
 * @async
 * @param {Array<object>} schemas - Array of JSON Schema objects to compile
 * @returns {Promise<Array<function>>} Array of compiled schema validator functions
 * @throws {Error} When schemas parameter is not an array or when schema registration fails
 */
export async function compileSchemas(schemas) {
  if (!Array.isArray(schemas)) {
    throw new Error(`Invalid "schemas" parameter: expected an array, received ${typeof schemas}`);
  }
  if (!schemas || schemas.length === 0) {
    console.log('Skipping compilation: no schemas provided.');
    return [];
  }
  const dialectId = 'http://json-schema.org/draft-07/schema#';
  const schemaUris = [];

  // Register all schemas first
  for (const schema of schemas) {
    const schemaURI = generateSchemaURI();
    registerSchema(schema, schemaURI, dialectId);
    schemaUris.push(schemaURI);
  }

  const compiledSchemas = [];
  for (const schemaUri of schemaUris) {
    const compileSchema = await validate(schemaUri);
    compiledSchemas.push(compileSchema);
  }
  return compiledSchemas;
}

/**
 * Compiles message schemas from an AsyncAPI document for a specific operation.
 * @async
 * @param {string} asyncapiFilepath - Path to the AsyncAPI document file
 * @param {string} operationId - ID of the operation to extract message schemas from
 * @returns {Promise<Array<function>>} Array of compiled schema validator functions
 * @throws {Error} When operationId is invalid or when the operation/messages can't be found
 */
export async function compileSchemasByOperationId(asyncapiFilepath, operationId) {
  if (typeof operationId !== 'string' || !operationId.trim()) {
    throw new Error(`Invalid "operationId" parameter: must be a non-empty string, received ${operationId}`);
  }
  const asyncapi = await parseAsyncAPIDocumentFromFile(asyncapiFilepath);
  const operation = asyncapi.operations().get(operationId);
  const messages = operation.messages().all();
  const schemas = messages
    .filter(message => message.hasPayload())
    .map(message => message.payload().json());
  return compileSchemas(schemas);
}

/**
 * Validates a message payload against an array of operation message schemas.
 * Uses the Hyperjump JSON Schema validator (Draft-07) to check if the message
 * conforms to at least one of the provided schemas.
 * @param {Array<function>} compiledSchemas - Array of compiled schema validator functions
 * @param {object} message - The message payload to validate
 * @returns {boolean} True if valid against any schema, false otherwise
 * @throws {Error} When message parameter is null or undefined
 */
export function validateMessage(compiledSchemas, message) {
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
 * Unregisters all currently registered schemas from the validator.
 * @returns {void}
 */
export function removeCompiledSchemas() {
  const schemaUris = getAllRegisteredSchemaUris();
  for (const schemaUri of schemaUris) {
    unregisterSchema(schemaUri);
  }
}