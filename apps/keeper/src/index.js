import { parseAsyncAPIDocumentFromFile } from './utils.js';
import Ajv from 'ajv';

const ajv = new Ajv({ strict: false, allErrors: true });

/**
 * Compiles a single JSON Schema for validation.
 * @param {object} schema - The JSON Schema object to compile.
 * @returns {function} A compiled schema validator function.
 * @throws {Error} Throws error if AJV cannot compile the schema.
 */
export function compileSchema(schema) {
  return ajv.compile(schema);
}

/**
 * Compiles multiple JSON Schemas for validation.
 * @param {Array<object>} schemas - Array of JSON Schema objects to compile.
 * @returns {Array<function>} Array of compiled schema validator functions.
 * @throws {Error} Throws error if AJV cannot compile a schema.
 */
export function compileSchemas(schemas) {
  if (!Array.isArray(schemas)) {
    throw new Error('Invalid "schemas" parameter: must be an array.');
  }
  const compiledSchemas = [];
  for (const schema of schemas) {
    compiledSchemas.push(compileSchema(schema));
  }
  return compiledSchemas;
}

/**
 * Compiles message schemas from an AsyncAPI document for a specific operation.
 * @async
 * @param {string} asyncapiFilepath - Path to the AsyncAPI document file
 * @param {string} operationId - ID of the operation to extract message schemas from
 * @returns {Promise<Array<function>>} A Promise that resolves to an array of compiled schema validator functions.
 * @throws {Error} When operationId is invalid or when the operation/messages can't be found.
 */
export async function compileSchemasByOperationId(asyncapiFilepath, operationId) {
  if (typeof operationId !== 'string' || !operationId.trim()) {
    throw new Error(`Invalid "operationId" parameter: must be a non-empty string, received ${operationId}`);  
  }
  const asyncapi = await parseAsyncAPIDocumentFromFile(asyncapiFilepath);
  const operation = asyncapi.operations().get(operationId);
  if (!operation) {
    throw new Error(`Operation with ID "${operationId}" not found in the AsyncAPI document.`);
  }
  const messages = operation.messages().all();
  if (!messages || messages.length === 0) {
    console.warn(`No messages found for operation ID "${operationId}".`);
    return [];
  }
  const schemas = messages
    .filter(message => message.hasPayload())
    .map(message => message.payload().json());  
  return compileSchemas(schemas);
}

/**
 * Validates a message payload against a compiled message schema.
 *
 * @param {function} compiledSchema - Compiled schema validator function.
 * @param {object} message - The message payload to validate.
 * @returns {{ isValid: boolean, validationErrors?: Array<object> }} Object containing validation result.
 * If invalid, `validationErrors` will contain the validation errors.
 * @throws {Error} When message parameter is null/undefined or compiledSchema is not a function.
 */
export function validateMessage(compiledSchema, message) {
  if (message === undefined) {
    throw new Error(`Invalid "message" parameter: expected a non-null object to validate, but received ${message}`);
  }
  if (typeof compiledSchema !== 'function') {
    throw new Error(`Invalid "compiledSchema" parameter: expected a validator function, received ${typeof compiledSchema}`);
  }
  const validate = compiledSchema(message);
  if (validate) {
    return { isValid: true };
  }
  return {
    isValid: false,
    validationErrors: compiledSchema.errors || []
  };
}