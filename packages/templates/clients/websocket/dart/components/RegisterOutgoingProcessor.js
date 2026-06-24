import { Text } from '@asyncapi/generator-react-sdk';

export function RegisterOutgoingProcessor() {
  return (
    <Text newLines={2} indent={2}>
      {`
/// Register a function that processes outgoing messages automatically.
void registerOutgoingProcessor(Function processor) {
  _outgoingProcessors.add(processor);
}
      `}
    </Text>
  );
}