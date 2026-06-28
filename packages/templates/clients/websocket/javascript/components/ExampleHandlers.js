import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleHandlers() {
  return (
    <Text newLines={2}>
      {`function myMessageHandler(message) {
  console.log('====================');
  console.log('Just proving I got the message in myMessageHandler:', message);
  console.log('====================');
}

function myErrorHandler(error) {
  console.error('Errors from WebSocket:', error.message);
}`}
    </Text>
  );
}
