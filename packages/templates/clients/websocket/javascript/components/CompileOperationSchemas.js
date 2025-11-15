import { Text } from '@asyncapi/generator-react-sdk';

export function CompileOperationSchemas({ sendOperations }) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }  

  return (
    <>
      <Text indent={2} newLines={2}>
        {
          `/**
 * Initialize and compile all schemas for operations defined.
 * This should be called once after creating the client instance.
 * Subsequent calls will be ignored if schemas are already compiled.
 * 
 * @returns {Promise<void>}
 * @throws {Error} If schema compilation fails for any operation
 */
async compileOperationSchemas() {
  if (this.schemasCompiled) {
    return;
  }

  try {
    // Compile schemas for all send operations
    for (const operationId of this.sendOperationsId) {
      this.compiledSchemas[operationId] = await compileSchemasByOperationId(asyncapiFilepath, operationId);
    }
    this.schemasCompiled = true;
    console.log('Schemas initialized successfully for operations:', this.sendOperationsId.join(', '));
  } catch (error) {
    console.error('Error initializing schemas:', error);
  }
}`
        }
      </Text>
    </>
  );
}
