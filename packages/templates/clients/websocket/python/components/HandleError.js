import { Text } from '@asyncapi/generator-react-sdk';

export function HandleError() {
  return (
    <Text newLines={2} indent={2}>
      {
        `def handle_error(self, error):
    """Pass the error to all registered error handlers. Generic log message is printed if no handlers are registered."""
    if len(self.error_handlers) == 0:
      print("\\033[91mError occurred:\\033[0m", error)
    else:
      # Call custom error handlers
      for handler in self.error_handlers:
        handler(error)`
      }
    </Text>
  );
}
