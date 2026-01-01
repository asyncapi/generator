import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';

/**
 * Component for rendering receive operation handler registration methods
 * Generates one specific method per operation for better DX
 */
export function RegisterReceiveOperations({ receiveOperations }) {
  if (!receiveOperations || receiveOperations.length === 0) {
    return null;
  }

  return receiveOperations.map((operation) => {
    const operationId = operation.id();
    const methodName = `register_${toSnakeCase(operationId)}_handler`;
    const summary = operation.summary() || `Handler for ${operationId} messages`;

    return (
      <Text indent={2} newLines={2} key={operationId}>
        {`def ${methodName}(self, handler, discriminator_key, discriminator_value):
    """
    Register a handler for ${operationId} operation.
    ${summary}

    Args:
        handler (callable): Handler function that receives parsed_message as argument
        discriminator_key (str): Message field to use for routing (e.g., 'type', 'event_type')
        discriminator_value (str): Expected value for routing (e.g., 'hello', 'user_joined')

    Example:
        def my_handler(message):
            print(f"Received: {message}")

        client.${methodName}(my_handler, discriminator_key="type", discriminator_value="hello")
    """
    if not callable(handler):
        print("Handler must be callable")
        return

    # Register handler
    self.receive_operation_handlers["${operationId}"] = handler

    # Register discriminator
    self.receive_operation_discriminators["${operationId}"] = {
        "key": discriminator_key,
        "value": discriminator_value
    }

    print(f"Registered handler for operation: ${operationId}")`}
      </Text>
    );
  });
}