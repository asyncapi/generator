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
