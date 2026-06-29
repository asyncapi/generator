import { Text } from '@asyncapi/generator-react-sdk';

export function ExampleOutgoingProcessor() {
  return (
    <Text newLines={2}>
      {`def outgoing_message_processor(message):
    """Process outgoing messages before they are sent (e.g., wrap with metadata)."""
    print(f"Outgoing processor fired: {message}")
    return {"payload": message, "timestamp": "2025-01-01T00:00:00Z"}`}
    </Text>
  );
}
