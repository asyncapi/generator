import { Text } from '@asyncapi/generator-react-sdk';

export function HandleError() {
  return (
    <Text newLines={2} indent={2}>
      {
        `def handle_error(self, error):
    """Pass the error to all registered error handlers."""
    print("Handling error:", error)
    for handler in self.error_handlers:
        handler(error)`
      }
    </Text>
  );
}
