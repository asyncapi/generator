import { Text } from '@asyncapi/generator-react-sdk';

export function ClientFields() {
  return (
    <Text indent={2} newLines={2}>
      {`@Inject
WebSocketClientConnection connection;`}
    </Text>
  );
}
