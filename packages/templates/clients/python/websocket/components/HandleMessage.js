import { Text } from '@asyncapi/generator-react-sdk';

export function HandleMessage() {
  return (
    <Text newLines={2} indent={2}>
      {
        `def handle_message(self, message):
    """Pass the incoming message to all registered message handlers."""
    print("\\033[94mProcessing message:\\033[0m", message)
    for handler in self.message_handlers:
        handler(message)`
      }
    </Text>
  );
}
