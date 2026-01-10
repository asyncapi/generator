import { getMessageExamples, getOperationMessages,toSnakeCase } from '@asyncapi/generator-helpers';
import { Text } from '@asyncapi/generator-react-sdk';

const languageConfig = {
  javascript: {
    label: 'JavaScript',
    codeBlock: 'javascript'
  },
  python: {
    label: 'Python',
    codeBlock: 'python'
  }
};

function renderExample({ label, codeBlock }, operationId, payload) {
  const opId =
    codeBlock === 'python'
      ? toSnakeCase(operationId)
      : operationId;

  return `
**Example (${label}):**
\`\`\`${codeBlock}
client.${opId}(${JSON.stringify(payload, null, 2)})
\`\`\`
`;
}

export default function MessageExamples({ operation }) {
  const operationId = operation.id();
  const messages = getOperationMessages(operation) || [];

  const messageExamples = [];
  messages.forEach((message) => {
    const examples = getMessageExamples(message) || [];
    examples.forEach((example) => {
      const payload = example.payload();
      Object.values(languageConfig).forEach((language) => {
        messageExamples.push(renderExample(language, operationId, payload));
      });
    });
  });

  if (messageExamples.length === 0) return null;

  return (
    <Text newLines={2}>
      {messageExamples.join('\n')}
    </Text>
  );
}
