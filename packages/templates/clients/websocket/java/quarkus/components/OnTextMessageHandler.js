import { Text } from '@asyncapi/generator-react-sdk';

export default function OnTextMessage({ sendOperations }) {
  return (
    <>
      {
        (sendOperations && sendOperations.length !== 0) && (
          sendOperations.map((operation) => {
            const methodName = operation.id();          
            return (
              <Text newLines={2} indent={2}>
                {`@OnTextMessage
public void ${methodName}(String message, WebSocketClientConnection connection) {
    Log.info("Received text message: " + message);
}`}
              </Text>
            );
          })
        )}

      {
        (!sendOperations || sendOperations.length === 0) && (
          <Text newLines={2} indent={2}>
            {`@OnTextMessage
public void processTextMessage(String message, WebSocketClientConnection connection) {
    Log.info("Received text message: " + message);
}`}
          </Text>

        )
      }
    </>
  );
}