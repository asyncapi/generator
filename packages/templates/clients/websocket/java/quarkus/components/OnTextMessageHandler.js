import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';

export default function OnTextMessage() {
  

  return (
  <Text newLines={2} indent={2}>
{`@OnTextMessage
public void onTextMessage(String message, WebSocketClientConnection connection) {
    Log.info("Received text message: " + message);
  
}`}
  </Text>
  );
}



/**
 * OLD
 * try {
    return input.sendMessage();  // can edit what gets sent later!! clientName.sendMessage("methodName}", message);
  } catch (Exception e) {
    System.err.println("Error sending: " + e.getMessage());
  }

  console.log('DEBUG OnTextMessage operation:\n', operation);
  const name = toSnakeCase(operation.id());
 */