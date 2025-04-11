import { Text } from '@asyncapi/generator-react-sdk';

export function SendEchoMessage() {
  return (
    <Text newLines={2} indent={2}>
      {
      `/// Method to send an echo message to the server
void sendEchoMessage(String message) {
  if (_channel != null) {
    _channel!.sink.add(message);
    print('Sent message to echo server: $message');
  }
}`
      }
    </Text>
  );
}
