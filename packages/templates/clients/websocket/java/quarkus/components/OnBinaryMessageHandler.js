import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';

export default function OnBinaryMessageHandler() {
  

  return (
  <Text newLines={2} indent={2}>
{`@OnBinaryMessage
public void onBinaryMessage( String message) {
    Log.info("Received from binary: " + message);
  
}`}
  </Text>
  );
}
