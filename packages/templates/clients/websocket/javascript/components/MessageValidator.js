import { Text } from '@asyncapi/generator-react-sdk';

//TODO: Currently, we use draft-07 for schema validation but plan to dynamically extract schemaFormat from AsyncAPI docs. The current registerSchema/unregisterSchema approach introduces validation delays, we should explore schema compilation to optimize this.

export function MessageValidator() {
  return (
    <Text newLines={2} indent={2}>
      {`/**
* Validates a message payload against an array of operation message schemas.
* This method uses the Hyperjump JSON Schema validator (Draft-07) to check if
* the given message object conforms to at least one of the provided operation-level
* message schemas (as defined in the AsyncAPI document).
* @async
* @static
* @param {Object} message - The message payload to be validated.
* @param {Array<Object>} schemas - An array of JSON Schema objects representing operation message schemas.
* @returns {Promise<boolean>} - Resolves to true if the message is valid against any of the schemas, otherwise false.
*/
static async messageValidator(message, schemas) {
  try {
    const { registerSchema, validate, unregisterSchema } = await import("@hyperjump/json-schema/draft-07");
    for (let i = 0; i < schemas.length; i++) {
      const schemaId = \`http://example.com/schema-\${i}\`;
      registerSchema(schemas[i], schemaId, "http://json-schema.org/draft-07/schema#");
      const result = await validate(schemaId, message);
      unregisterSchema(schemaId);
      if (result.valid) return true;
    }
    return false;  
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
}`}
    </Text>
  );
}