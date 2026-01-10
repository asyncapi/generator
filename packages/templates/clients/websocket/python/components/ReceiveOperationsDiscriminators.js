import { Text } from '@asyncapi/generator-react-sdk';

/**
* Extracts discriminator metadata from a message for operation routing.
* 
* @param {object} message - The AsyncAPI message object containing payload and discriminator info.
* @param {string} operationId - The operation ID associated with this message.
* @returns {object|null} An object with key, value, and operation_id if discriminator is valid; otherwise null.
*/
const getDiscriminatorData = (message, operationId) => {
  const payload = message.payload();
  const discriminator = payload.discriminator();
  
  if (!discriminator) {
    return null;
  }

  const discriminator_key = discriminator;
  const properties = payload.properties();
  
  if (!properties || !properties[discriminator_key]) {
    return null;
  }

  const discriminatorProperty = properties[discriminator_key];
  const discriminator_value = discriminatorProperty.const();

  if (!discriminator_value) {
    return null;
  }

  return {
    key: discriminator_key,
    value: discriminator_value,
    operation_id: operationId
  };
};

/**
* Generates Python initialization code for receive operation discriminators.
* 
* @param {object} props - Component props.
* @param {Array} props.receiveOperations - Array of receive operations from AsyncAPI document.
* @returns {React.Element|null} A Text component rendering Python code, or null if no operations.
*/
export function ReceiveOperationsDiscriminators({ receiveOperations }) {
  const hasReceiveOperations = receiveOperations && receiveOperations.length > 0;
  if (!hasReceiveOperations) {
    return null;
  }

  const receiveOperationDiscriminators = [];

  receiveOperations.forEach((operation) => {
    const operationId = operation.id();
    const messages = operation.messages().all();

    messages
      .filter(message => message.hasPayload())
      .forEach(message => {
        const discriminatorData = getDiscriminatorData(message, operationId);
        if (discriminatorData) {
          receiveOperationDiscriminators.push(discriminatorData);
        }
      });
  });

  const formattedDiscriminators = JSON.stringify(receiveOperationDiscriminators);

  return (
    <Text indent={2} newLines={2}>
      {`
      self.receive_operation_handlers = {}
      self.receive_operation_discriminators = ${formattedDiscriminators}
      `}
    </Text>
  );
}