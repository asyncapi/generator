import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleOutgoingProcessor() {
  return (
    <Text newLines={2}>
      {`function outgoingProcessor(message) {
  const processed = { payload: message, timestamp: new Date().toISOString() };
  console.log('Outgoing processor fired:', JSON.stringify(processed));
  return processed;
}`}
    </Text>
  );
}
