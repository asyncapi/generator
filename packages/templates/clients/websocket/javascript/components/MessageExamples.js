import { getMessageExamples, getOperationMessages } from '@asyncapi/generator-helpers';
import { Text } from '@asyncapi/generator-react-sdk';

export default function MessageExamples({operation}) {
  const operationId = operation.id();
  const messageExamples = [];
  const messages = getOperationMessages(operation) || [];

  messages.forEach((message) => {
    const examples = getMessageExamples(message) || [];
    examples.forEach((example) => {
      const payload = example.payload();
      messageExamples.push(`\n\n**Example:**\n\`\`\`javascript\nclient.${operationId}(${JSON.stringify(payload, null, 2)});\n\`\`\``);
    });
  });
  return (
    <Text>
      {messageExamples.map(example => (
        <Text>
          {example}
        </Text>
      ))}
    </Text>
  );
}