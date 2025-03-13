import { Text } from '@asyncapi/generator-react-sdk';

export function HandleMessage () {
  return (
  <Text>
    <Text>
        {
          `  // Method to handle message with callback
  handleMessage(message, cb) {
    if (cb) cb(message);
  }`
        }
    </Text>
  </Text>
  );
}
