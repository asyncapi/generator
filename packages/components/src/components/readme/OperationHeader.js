import { Text } from '@asyncapi/generator-react-sdk';

export default function OperationHeader({ operation }) {
  const operationId = operation.id();
  const summary = operation.hasSummary() ? operation.summary() : '';
  const description = operation.hasDescription() ? `\n${operation.description()}` : '';

  const header = `#### \`${operationId}(payload)\`
${summary}${description}`;

  return (
    <Text newLines={2}>
      {header}
    </Text>
  );
}