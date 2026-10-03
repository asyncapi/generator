import { Text } from '@asyncapi/generator-react-sdk';

/**
 * Renders the compileOperationSchemas method for the server class.
 *
 * @param {Object} props Component props.
 * @param {Array<string>} props.allOps List of operation IDs to compile schemas for.
 * @returns {JSX.Element} Method definition.
 */
export function CompileOperationSchemas({ allOps = [] }) {
  return (
    <Text indent={2} newLines={2}>
      {`/**
   * Compiles message schemas from the AsyncAPI document using @asyncapi/keeper.
   *
   * @returns {Promise<void>}
   */
  async compileOperationSchemas() {
    if (this.schemasCompiled) {
      return;
    }

    for (const operationId of this.allOperationIds) {
      try {
        this.compiledSchemas[operationId] = await compileSchemasByOperationId(this.asyncapiFilepath, operationId);
      } catch (err) {
        console.warn(\`[WebSocketServer] Schema compilation skipped for operation "\${operationId}": \${err.message}\`);
      }
    }

    this.schemasCompiled = true;
  }`}
    </Text>
  );
}
