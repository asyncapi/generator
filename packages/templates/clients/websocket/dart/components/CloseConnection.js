import { Text } from '@asyncapi/generator-react-sdk';

export function CloseConnection() {
  return (
    <Text indent={2}>
      {
        `/// Method to close the WebSocket connection
void close() {
  _channel?.sink.close();
  _channel = null;
  print('WebSocket connection closed.');
}`}
    </Text>
  );
}
