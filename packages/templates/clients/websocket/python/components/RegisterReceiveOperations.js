import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';

/**
 * Component for rendering receive operation handler registration methods
 * Generates one specific method per operation for better DX
 * 
* @param {Object} props - Component props
* @param {Array} props.receiveOperations - Array of receive operations from AsyncAPI document
* @returns {Array<React.Element>|null} Array of Text components containing Python handler registration methods, or null if no operations
 */
export function RegisterReceiveOperations({ receiveOperations }) {
  if (!receiveOperations || receiveOperations.length === 0) {
    return null;
  }

  return receiveOperations.map((operation) => {
    const operationId = operation.id();
    const methodName = `register_${toSnakeCase(operationId)}_handler`;

    return (
      <Text indent={2} newLines={2} key={operationId}>
        {`def ${methodName}(self, handler, discriminator_key=None, discriminator_value=None):
    """
    Register a handler for ${operationId} operation.

    Args:
        handler (callable): Handler function that receives raw_message as argument
        discriminator_key (str): Message field to use for routing (e.g., 'type', 'event_type')
        discriminator_value (str): Expected value for routing (e.g., 'hello', 'user_joined')
    """
    if not callable(handler):
        print("Handler must be callable")
        return

    # Validate that either both discriminator_key and discriminator_value are provided or neither
    if (discriminator_key is not None and discriminator_value is None) or (discriminator_key is None and discriminator_value is not None):
        print("Error: Both discriminator_key and discriminator_value must be provided together")
        return

    # Register handler
    self.receive_operation_handlers["${operationId}"] = handler

    # Add discriminator entry to the list if both key and value are provided
    if discriminator_key is not None and discriminator_value is not None:
        discriminator_entry = {
            "key": discriminator_key,
            "value": discriminator_value,
            "operation_id": "${operationId}"
        }
        
        # Check if this discriminator already exists
        exists = any(
            d.get("key") == discriminator_key and 
            d.get("value") == discriminator_value and 
            d.get("operation_id") == "${operationId}" 
            for d in self.receive_operation_discriminators
        )

        if not exists:
          self.receive_operation_discriminators.append(discriminator_entry)`}
      </Text>
    );
  });
}