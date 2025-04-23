import { Text } from '@asyncapi/generator-react-sdk';

export default function OperationHeader({operation}) {
  const operationId = operation.id();
  return (
    <Text>
      {`#### \`${operationId}(payload)\`
${operation.summary() || ''}
${operation.description() ? `\n${operation.description()}` : ''}`}
    </Text>
  );
}