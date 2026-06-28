import { Text } from '@asyncapi/generator-react-sdk';
import { getOperationMessages, getMessageExamples } from '@asyncapi/generator-helpers';

function toDartLiteral(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    // Why: Dart string interpolation uses `$`, so `$foo` inside a single-quoted
    // string is a variable reference at compile time. Escape it (along with `\`
    // and `'`) so example payloads are treated as literal text.
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'')
      .replace(/\$/g, '\\$');
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(toDartLiteral).join(', ')}]`;
  }
  const entries = Object.entries(value).map(
    ([k, v]) => `'${k}': ${toDartLiteral(v)}`
  );
  return `{${entries.join(', ')}}`;
}

function resolvePayloadLiteral(operation) {
  const messages = getOperationMessages(operation);
  if (!messages || messages.length === 0) {
    return `'TODO: replace with payload for ${operation.id()}'`;
  }
  const message = messages[0];
  const examples = getMessageExamples(message);
  if (!examples) {
    const name = message.name() || operation.id();
    return `'TODO: replace with payload matching ${name}'`;
  }
  return toDartLiteral(examples.all()[0].payload());
}

export function ExampleSendInvocations({ instanceName, sendOps }) {
  if (!sendOps || sendOps.length === 0) {
    return null;
  }

  const iterations = 5;

  const calls = sendOps
    .map((op) => `    ${instanceName}.${op.id()}(${resolvePayloadLiteral(op)});`)
    .join('\n');

  return (
    <Text indent={4}>
      {`for (var i = 0; i < ${iterations}; i++) {
  try {
${calls}
  } catch (error) {
    print('Error while sending message: $error');
  }
  await Future.delayed(Duration(seconds: 5));
}`}
    </Text>
  );
}
