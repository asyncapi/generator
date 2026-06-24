import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleHandlers() {
  return (
    <Text newLines={2}>
      {`void myMessageHandler(String message) {
  print('====================');
  print('Just proving I got the message in myMessageHandler: $message');
  print('====================');
}

void myErrorHandler(Object error) {
  print('Errors from WebSocket: $error');
}`}
    </Text>
  );
}
