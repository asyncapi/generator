import { Text } from '@asyncapi/generator-react-sdk';

export function SendEchoMessage() {
  return (
    <Text newLines={2} indent={2}>
      {
        `/// Method to send an echo message to the server
void sendEchoMessage(dynamic message) {
  if (_channel == null) {
    print('Error: WebSocket is not connected.');
    return;
  }
  
  // Run all outgoing processors sequentially
  for (var processor in _outgoingProcessors) {
      processedMessage = processor(message);
  }


  final payload = processedMessage is String ? processedMessage : jsonEncode(processedMessage);
  _channel!.sink.add(payload);
  print('Sent message to echo server: $payload');
}`
      }
    </Text>
  );
}
