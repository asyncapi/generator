import { Text } from '@asyncapi/generator-react-sdk';

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

  if (!discriminator_key || !discriminator_value) {
    return null;
  }

  return {
    key: discriminator_key,
    value: discriminator_value,
    operation_id: operationId
  };
};

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