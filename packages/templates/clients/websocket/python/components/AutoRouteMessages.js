import { Text } from '@asyncapi/generator-react-sdk';

/**
 * Generates the _route_message method for the WebSocket client.
 * This method routes incoming messages to appropriate handlers based on discriminators.
 * 
 * @returns {JSX.Element} Text component containing the _route_message method implementation
 */
export function AutoRouteMessages() {
  return (
    <Text indent={2} newLines={2}>
      {`def _route_message(self, parsed_message, raw_message):
    """
    Route incoming message to appropriate handler based on discriminators.

    Args:
        parsed_message: Parsed message object
        raw_message: Raw message string

    bool: Always returns False as handlers are called directly without indicating if they succeeded
    """
    if not isinstance(parsed_message, dict):
        return False

    # Check each operation's discriminator
    for discriminator in self.receive_operation_discriminators:
        key = discriminator.get("key")
        value = discriminator.get("value")
        operation_id = discriminator.get("operation_id")

        # Check if message matches this discriminator
        if key and parsed_message.get(key) == value:
            handler = self.receive_operation_handlers.get(operation_id)
            if handler:
                try:
                    handler(raw_message)
                except Exception as error:
                    print(f"Error in {operation_id} handler: {error}")

    return False`}
    </Text>
  );
}