import { Text } from '@asyncapi/generator-react-sdk';

export function HandleError() {
  return (
    <Text newLines={2} indent={2}>
      {
        `/// Pass the error to all registered error handlers.
/// A generic log message is printed if no handlers are registered.
void _handleError(Object error) {
  if (_errorHandlers.isEmpty) {
    print('Error occurred: $error');
  } else {
    for (final handler in _errorHandlers) {
      handler(error);
    }
  }
}`
      }
    </Text>
  );
}
