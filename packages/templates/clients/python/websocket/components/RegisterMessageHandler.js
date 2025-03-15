import { Text } from '@asyncapi/generator-react-sdk';

export function RegisterMessageHandler() {
  return (
    <Text newLines={2} indent={2}>
      {
        `def register_message_handler(self, handler):
    """Register a callable to process incoming messages."""
    if callable(handler):
        self.message_handlers.append(handler)
    else:
        print("Message handler must be callable")`
      }
    </Text>
  );
}
