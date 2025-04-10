import { Text } from '@asyncapi/generator-react-sdk';

export function SendEchoMessage() {
  return (
    <Text newLines={2} indent={2}>
      {
        `/**
   * By default sends a message over a provided WebSocket connection.
   * Useful when you already have an established WebSocket connection
   * and want to send a message without creating a class instance.
   *
   * @param {Object} message - The message to send. It will be stringified to JSON.
   * @param {WebSocket} socket - An existing WebSocket connection to use for sending the message.
*/
static sendEchoMessage(message, socket) {
  if (socket) this.websocket = socket;
  this.websocket.send(JSON.stringify(message));
}`
      }
    </Text>
  );
}
