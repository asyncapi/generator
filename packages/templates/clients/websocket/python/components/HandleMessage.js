import { Text } from '@asyncapi/generator-react-sdk';

export function HandleMessage() {
  return (
    <Text newLines={2} indent={2}>
      {
        `def handle_message(self, message):
    """Pass the incoming message to all registered message handlers. """
    if len(self.message_handlers) == 0:
      print("\\033[94mReceived raw message:\\033[0m", message)
    else:
      for handler in self.message_handlers:
        handler(message)`
      }
    </Text>
  );
}
