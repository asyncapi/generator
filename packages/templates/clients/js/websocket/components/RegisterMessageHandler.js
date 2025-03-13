import { Text } from '@asyncapi/generator-react-sdk';

export function RegisterMessageHandler () {
  return (
  <Text>
    <Text>
        {
          `  // Method to register custom message handlers
  registerMessageHandler(handler) {
    if (typeof handler === 'function') {
      this.messageHandlers.push(handler);
    } else {
      console.warn('Message handler must be a function');
    }
  }`
        }
    </Text>
  </Text>
  );
}
