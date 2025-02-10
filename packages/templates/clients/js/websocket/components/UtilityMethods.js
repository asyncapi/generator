import { Text } from '@asyncapi/generator-react-sdk';

// Method to handle message with callback
export function HandleMessageMethod() {
  return (
    <Text>
      {`
  handleMessage(message, cb) {
    if (cb) cb(message);
  }`}
    </Text>
  );
}

// Method to send an echo message to the server
export function SendEchoMessageMethod() {
  return (
    <Text>
      {`
  sendEchoMessage(message) {
    this.websocket.send(JSON.stringify(message));
    console.log('Sent message to echo server:', message);
  }`}
    </Text>
  );
}

// Method to close the WebSocket connection
export function CloseMethod() {
  return (
    <Text>
      {`
  close() {
    if (this.websocket) {
      this.websocket.close();
      console.log('WebSocket connection closed.');
    }
  }`}
    </Text>
  );
}