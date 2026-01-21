import { Text } from '@asyncapi/generator-react-sdk';

export function CompileOperationSchemas({ sendOperations }) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }  

  return (
    <>
      <Text indent={2} newLines={2}>
       {/* Initialize and compile all schemas for operations defined. This should be called once after creating the client instance. Subsequent calls will be ignored if schemas are already compiled. */}
      </Text>
    </>
  );
}
