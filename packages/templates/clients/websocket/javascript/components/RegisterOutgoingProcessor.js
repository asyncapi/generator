import { Text } from '@asyncapi/generator-react-sdk';

export function RegisterOutgoingProcessor() {
  return (
    <Text newLines={2} indent={2}>
      {
        `registerOutgoingProcessor(processor) {
  if (typeof processor === 'function') {
    this.outgoingProcessors.push(processor);
  } else {
    console.warn('Outgoing processor must be a function');
  }
}`
      }
    </Text>
  );
}
