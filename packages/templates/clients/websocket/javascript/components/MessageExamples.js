import { getMessageExamples,  } from '@asyncapi/generator-helpers';
import { getOperationMessages } from '@asyncapi/generator-helpers/src/operations';
import { Text } from '@asyncapi/generator-react-sdk';

export default function MessageExamples({operation}) {
  const operationId = operation.id();
  let messageExamples = '';
  const messages = getOperationMessages(operation);

  if (messages) {
    const firstMessage = messages[0];
    const firstExample = getMessageExamples(firstMessage) ? getMessageExamples(firstMessage)[0] : null;
    if (firstExample) {
      const payload = firstExample.payload();
      messageExamples = `\n\n**Example:**\n\`\`\`javascript\nclient.${operationId}(${JSON.stringify(payload, null, 2)});\n\`\`\``;
    }
  }

  return (
    <Text>
      {messageExamples}
    </Text>
  );
}