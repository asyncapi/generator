import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';

export function ExampleHandlers({ receiveOps }) {
  const ops = Array.isArray(receiveOps) ? receiveOps : [];

  const handlerDefs = ops
    .map((op) => {
      const snake = toSnakeCase(op.id());
      return `def handle_${snake}(message):
    print(f"[${op.id()}] Received message: {message}")`;
    })
    .join('\n\n');

  const errorHandler = `def custom_error_handler(error):
    print(f"WebSocket error: {error}")`;

  const body = handlerDefs.length > 0
    ? `${handlerDefs}\n\n${errorHandler}`
    : errorHandler;

  return (
    <Text newLines={2}>
      {body}
    </Text>
  );
}
