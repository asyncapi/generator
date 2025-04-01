import { Text } from '@asyncapi/generator-react-sdk';

export function HandleMessage() {
  return (
    <Text newLines={2} indent={2}>
      {
        `// Method to handle message with callback
handleMessage(message, cb) {
  if (cb) cb(message);
}`
      }
    </Text>
  );
}
