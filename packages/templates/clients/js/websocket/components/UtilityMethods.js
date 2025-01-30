import { Text } from '@asyncapi/generator-react-sdk';

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