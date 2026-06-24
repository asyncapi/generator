import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleReceiveWait({ seconds = 10 }) {
  return (
    <Text indent={4} newLines={2}>
      {`// Wait for incoming messages to be processed by myMessageHandler.
await Future.delayed(Duration(seconds: ${seconds}));`}
    </Text>
  );
}
