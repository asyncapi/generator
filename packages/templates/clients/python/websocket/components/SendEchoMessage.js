import { Text } from '@asyncapi/generator-react-sdk';

export function SendEchoMessage() {
  return (
    <Text newLines={2} indent={2}>
      {
        `def send_message(self, message):
    """
    Automatically process the outgoing message with registered processors and send it
    using the active WebSocket connection.
    """
    # Apply outgoing processors sequentially.
    for processor in self.outgoing_processors:
        message = processor(message)

    if self.ws_app and self.ws_app.sock and self.ws_app.sock.connected:
        try:
            self.ws_app.send(json.dumps(message))
            print("\\033[92mSent:\\033[0m", message)
        except Exception as error:
            self.handle_error(error)
    else:
        print("Error: WebSocket is not connected.")`
      }
    </Text>
  );
}
