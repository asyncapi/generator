import { Text } from '@asyncapi/generator-react-sdk';
import { getOperationMessages, getMessageExamples } from '@asyncapi/generator-helpers';

function toJsLiteral(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'');
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(toJsLiteral).join(', ')}]`;
  }
  const entries = Object.entries(value).map(
    ([k, v]) => `${JSON.stringify(k)}: ${toJsLiteral(v)}`
  );
  return `{ ${entries.join(', ')} }`;
}

function resolvePayloadLiteral(operation) {
  const messages = getOperationMessages(operation);
  if (!messages || messages.length === 0) {
    return `'TODO: replace with payload for ${operation.id()}'`;
  }
  const message = messages[0];
  const examples = getMessageExamples(message);
  if (!examples) {
    const name = (message.name && message.name()) || operation.id();
    return `'TODO: replace with payload matching ${name}'`;
  }
  return toJsLiteral(examples.all()[0].payload());
}

export function ExampleSendInvocations({ instanceName, sendOps }) {
  if (!sendOps || sendOps.length === 0) {
    return null;
  }

  const iterations = 5;

  const calls = sendOps
    .map((op) => `      await ${instanceName}.${op.id()}(${resolvePayloadLiteral(op)});`)
    .join('\n');

  return (
    <Text indent={4}>
      {`for (let i = 0; i < ${iterations}; i++) {
  try {
${calls}
  } catch (error) {
    console.error('Error while sending message:', error);
  }
  await new Promise(resolve => setTimeout(resolve, 5000));
}`}
    </Text>
  );
}
