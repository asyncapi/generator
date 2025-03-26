import { Text } from '@asyncapi/generator-react-sdk';

export function RegisterErrorHandler() {
  return (
    <Text newLines={2} indent={2}>
      {
        `def register_error_handler(self, handler):
    """Register a callable to process errors."""
    if callable(handler):
        self.error_handlers.append(handler)
    else:
        print("Error handler must be callable")`
      }
    </Text>
  );
}
