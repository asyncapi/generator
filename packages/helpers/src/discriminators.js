/**
* Extracts discriminator metadata from a message for operation routing.
* 
* @param {object} message - The AsyncAPI message object containing payload and discriminator info.
* @param {string} operationId - The operation ID associated with this message.
* @returns {object|null} An object with key, value, and operation_id if discriminator is valid; otherwise null.
*/
const getMessageDiscriminatorData = (message, operationId) => {
  const payload = message.payload();
  if (!payload) {
    return null;
  }
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
 * Get discriminator metadata from all messages across a list of AsyncAPI operations.
 *
 * @param {Array<object>} operations - List of AsyncAPI Operation objects.
 * @returns {Array<object>} Array of discriminator metadata objects with key, value, and operation_id.
 */
const getMessageDiscriminatorsFromOperations = (operations) => {
  const operationDiscriminators = [];

  operations.forEach((operation) => {
    const operationId = operation.id();
    const messages = operation.messages().all();

    messages
      .filter(message => message.hasPayload())
      .forEach(message => {
        const discriminatorData = getMessageDiscriminatorData(message, operationId);
        if (discriminatorData) {
          operationDiscriminators.push(discriminatorData);
        }
      });
  });

  return operationDiscriminators;
};

module.exports = {
  getMessageDiscriminatorData,
  getMessageDiscriminatorsFromOperations
};