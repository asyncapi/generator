import { Text } from '@asyncapi/generator-react-sdk';
import {
  getOperationMessages,
  getMessageExamples,
  toSnakeCase,
} from '@asyncapi/generator-helpers';

function toPyLiteral(value) {
  if (value === null || value === undefined) return 'None';
  if (typeof value === 'boolean') return value ? 'True' : 'False';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'');
    return `'${escaped}'`;
  }
  if (Array.isArray(value)) {
    return `[${value.map(toPyLiteral).join(', ')}]`;
  }
  const entries = Object.entries(value).map(
    ([k, v]) => `${JSON.stringify(k)}: ${toPyLiteral(v)}`
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
    const name = (message.name && message.name()) || operation.id();
    return `'TODO: replace with payload matching ${name}'`;
  }
  return toPyLiteral(examples.all()[0].payload());
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
    .map((op) => {
      const method = toSnakeCase(op.id());
      return `    try:
        ${instanceName}.${method}(${resolvePayloadLiteral(op)})
    except Exception as e:
        print(f"Error while sending ${method}: {e}")`;
    })
    .join('\n');

  const tail =
    remainder > 0
      ? `\n    # ... ${remainder} more send operation${remainder > 1 ? 's' : ''} elided from the example.`
      : '';

  return (
    <Text indent={8}>
      {`for i in range(${iterations}):
${calls}${tail}
    time.sleep(2)`}
    </Text>
  );
}
