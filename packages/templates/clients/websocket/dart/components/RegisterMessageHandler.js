import { Text } from '@asyncapi/generator-react-sdk';

export function RegisterMessageHandler() {
  return (
    <Text newLines={2} indent={2}>
      {
      `/// Method to register custom message handlers
void registerMessageHandler(void Function(String) handler) {
  _messageHandlers.add(handler);
}`
      }
    </Text>
  );
}
