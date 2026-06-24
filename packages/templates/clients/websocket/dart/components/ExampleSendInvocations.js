import { Text } from '@asyncapi/generator-react-sdk';
import { getOperationMessages, getMessageExamples } from '@asyncapi/generator-helpers';

function toDartLiteral(value) {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'')
      .replace(/\$/g, '\\$');
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(toDartLiteral).join(', ')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([k, v]) => `'${k}': ${toDartLiteral(v)}`
    );
    return `{${entries.join(', ')}}`;
  }
  return `'TODO: unsupported example type ${typeof value}'`;
}

function resolvePayloadLiteral(operation) {
  const messages = getOperationMessages(operation);
  if (!messages || messages.length === 0) {
    return `'TODO: replace with payload for ${operation.id()}'`;
  }
  const message = messages[0];
  const examples = getMessageExamples(message);
  if (!examples) {
    const name = (typeof message.name === 'function' && message.name()) || operation.id();
    return `'TODO: replace with payload matching ${name}'`;
  }
  const first = examples.all()[0];
  let raw;
  if (typeof first.payload === 'function') {
    raw = first.payload();
  } else if (typeof first.value === 'function') {
    raw = first.value();
  } else if (first && typeof first === 'object' && Object.prototype.hasOwnProperty.call(first, 'payload')) {
    raw = first.payload;
  } else {
    raw = first;
  }
  return toDartLiteral(raw);
}

export function ExampleSendInvocations({
  instanceName,
  sendOps,
  iterations = 5,
  maxOpsToList = 5,
}) {
  if (!sendOps || sendOps.length === 0) {
    return null;
  }

  const opsToList = sendOps.slice(0, maxOpsToList);
  const remainder = sendOps.length - opsToList.length;

  const calls = opsToList
    .map((op) => `    ${instanceName}.${op.id()}(${resolvePayloadLiteral(op)});`)
    .join('\n');

  const tail =
    remainder > 0
      ? `\n    // ... ${remainder} more send operation${remainder > 1 ? 's' : ''} elided from the example.`
      : '';

  return (
    <Text indent={4}>
      {`for (var i = 0; i < ${iterations}; i++) {
  try {
${calls}${tail}
  } catch (error) {
    print('Error while sending message: $error');
  }
  await Future.delayed(Duration(seconds: 2));
}`}
    </Text>
  );
}
