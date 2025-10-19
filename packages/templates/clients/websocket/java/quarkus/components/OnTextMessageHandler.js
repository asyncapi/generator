import { Text } from '@asyncapi/generator-react-sdk';
import { toCamelCase } from '@asyncapi/generator-helpers';

export default function OnTextMessage({ sendOperations }) {
  return (
    <>
      {
        (sendOperations && sendOperations.length !== 0) && (
          sendOperations.map((operation, idx) => {
            const methodName = operation.id(); 
            const annotation = idx === 0 ? '@OnTextMessage' : '';
            const javaMethodName = toCamelCase(methodName);
            return (
              <Text newLines={2} indent={2}>
                {`${annotation}
public void ${javaMethodName}(String message, WebSocketClientConnection connection) {
    LOG.info("Received text message: " + message);
}`}
              </Text>
            );
          })
        )}

      {
        // need a default handler
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