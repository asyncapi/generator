import { Text } from '@asyncapi/generator-react-sdk';

export function RegisterErrorHandler() {
  return (
    <Text newLines={2} indent={2}>
      {
        `/// Method to register custom error handlers
void registerErrorHandler(void Function(Object) handler) {
  _errorHandlers.add(handler);
}`
      }
    </Text>
  );
}
