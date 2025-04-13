import { Text } from '@asyncapi/generator-react-sdk';

export function CloseConnection() {
  return (
    <Text indent={2}>
      {
        `/// Method to close the WebSocket connection
void close() {
  if (_channel != null) {
    _channel!.sink.close();
    print('WebSocket connection closed.');
  } else {
    print('No active WebSocket connection to close.');
  }
}`}
    </Text>
  );
}
