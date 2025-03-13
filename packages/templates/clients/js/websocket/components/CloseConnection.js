import { Text } from '@asyncapi/generator-react-sdk';

export function CloseConnection() {
  return (
    <Text>
      {
        `  // Method to close the WebSocket connection
  close() {
    if (this.websocket) {
      this.websocket.close();
      console.log('WebSocket connection closed.');
    }
  }`
      }
    </Text>
  );
}
