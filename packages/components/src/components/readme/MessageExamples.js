import { getMessageExamples, getOperationMessages } from '@asyncapi/generator-helpers';
import { Text } from '@asyncapi/generator-react-sdk';

const exampleTemplate = (operationId, payload) => `
**Example:**
\`\`\`javascript
client.${operationId}(${JSON.stringify(payload, null, 2)});
\`\`\`
`;

export default function MessageExamples({ operation }) {
  const operationId = operation.id();
  const messages = getOperationMessages(operation) || [];

  const messageExamples = [];
  messages.forEach((message) => {
    const examples = getMessageExamples(message) || [];
    examples.forEach((example) => {
      const payload = example.payload();
      messageExamples.push(exampleTemplate(operationId, payload));
    });
  });

  if (messageExamples.length === 0) return null;

  return (
    <Text newLines={2}>
      {messageExamples.join('\n')}
    </Text>
  );
}
