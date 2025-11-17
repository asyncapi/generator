import { Text } from '@asyncapi/generator-react-sdk';
import { toCamelCase } from '@asyncapi/generator-helpers';

export default function OnTextMessage({ sendOperations }) {
  return (
    <>
      {
        // If there are operations, emit a single @OnTextMessage
        (sendOperations && sendOperations.length !== 0) && (
          <Text newLines={2} indent={2}>
            {`@OnTextMessage
public void handleTextMessage(String message, WebSocketClientConnection connection) {
    LOG.info("Handler received text message: " + message);
${sendOperations.map((operation, idx) => {
            const methodName = operation.id();
            const javaMethodName = toCamelCase(methodName);
            const condition = idx === 0 ? `    if (message != null && message.contains("${methodName}")) {` : `    else if (message != null && message.contains("${methodName}")) {`;
            return `${condition}
        ${javaMethodName}(message, connection);
    }`;
          }).join('\n')}
    else {
        LOG.warn("Handler received unrecognized message type. Falling back to default handler.");
        // Note: By default, we route unrecognized messages to the first operation handler.
        // Depending on your business logic, you may want to change this behavior.
        ${toCamelCase(sendOperations[0].id())}(message, connection);
    }
}`}
          </Text>
        )
      }

      {
        // Generate handlers for each operation
        (sendOperations && sendOperations.length !== 0) && (
          sendOperations.map((operation) => {
            const methodName = operation.id();
            const javaMethodName = toCamelCase(methodName);
            return (
              <Text newLines={2} indent={2}>
                {`public void ${javaMethodName}(String message, WebSocketClientConnection connection) {
    LOG.info("Processing ${methodName} type message: " + message);
    // TODO: implement processing logic for ${methodName}
}`}
              </Text>
            );
          })
        )
      }

      {
        // No operations provided need a default handler
        (!sendOperations || sendOperations.length === 0) && (
          <Text newLines={2} indent={2}>
            {`@OnTextMessage
public void processTextMessage(String message, WebSocketClientConnection connection) {
    LOG.info("Received text message: " + message);
}`}
          </Text>

        )
      }
    </>
  );
}