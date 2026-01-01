import { getMessageExamples, getOperationMessages } from '@asyncapi/generator-helpers';
import { Text } from '@asyncapi/generator-react-sdk';

const languageConfig = {
  javascript: {
    label: 'JavaScript',
    codeBlock: 'javascript',
    render: (operationId, payload) => `
**Example (JavaScript):**
\`\`\`javascript
client.${operationId}(${JSON.stringify(payload, null, 2)});
\`\`\`
`
  },
  python: {
    label: 'Python',
    codeBlock: 'python',
    render: (operationId, payload) => {
      const pythonPayload = JSON.stringify(payload, null, 2)
        .replace(/"([^"]+)":/g, '$1:')
        .replace(/true/g, 'True')
        .replace(/false/g, 'False')
        .replace(/null/g, 'None');

      return `
**Example (Python):**
\`\`\`python
client.${operationId}(
${pythonPayload}
)
\`\`\`
`;
    }
  }
};

export default function MessageExamples({ operation }) {
  const operationId = operation.id();
  const messages = getOperationMessages(operation) || [];

  const messageExamples = [];
  messages.forEach((message) => {
    const examples = getMessageExamples(message) || [];
    examples.forEach((example) => {
      const payload = example.payload();
      Object.values(languageConfig).forEach(({ render }) => {
        messageExamples.push(render(operationId, payload));
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
