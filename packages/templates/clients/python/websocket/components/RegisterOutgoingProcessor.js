import { Text } from '@asyncapi/generator-react-sdk';

export function RegisterOutgoingProcessor() {
  return (
    <Text newLines={2} indent={2}>
      {
        `def register_outgoing_processor(self, processor):
    """
    Register a callable that processes outgoing messages automatically.
    These processors run in sequence before each message is sent.
    """
    if callable(processor):
        self.outgoing_processors.append(processor)
    else:
        print("Outgoing processor must be callable")`
      }
    </Text>
  );
}
