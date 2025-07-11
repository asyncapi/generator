import { Text } from '@asyncapi/generator-react-sdk';

export default function OnTextMessage({sendOperations}) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }

  return (
    <>
      {
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
      }
    </>
  );
}