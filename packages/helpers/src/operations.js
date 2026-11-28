
/**
 * Get messages related to the provided operation.
 * @param {object} operation - The AsyncAPI operation object. 
 * @throws {Error} If opeartion object is not provided or is invalid.
 * 
 * @returns {null} if there are no messages
 * @returns messages resulting from operation
 */
function getOperationMessages(operation) {
  if (!operation) {
    throw new Error('Operation object must be provided.');
  }
  const messages = operation.messages();
  if (messages.isEmpty()) {
    return null;
  }
  return messages.all();
}
/**
   * Get examples related to the provided message.
   * @param {object} message 
   * @returns {Array} - An array of examples for the provided message.
   * @returns {null} if there are no examples
   * @throws {Error} If message object is not provided or is invalid.
   */
  
function getMessageExamples(message) {
  if (!message) {
    throw new Error('Message object must be provided.');
  }
  const examples = message.examples();
  if (examples.isEmpty()) {
    return null;
  }
  return examples;
}

/**
 * Get the operation ids of a channel as one comma separated string:
 * the ids of its send operations, then the ids of its receive operations.
 *
 * @param {object} channel - The AsyncAPI channel object.
 *
 * @returns {string} The operation ids joined with `, `, or an empty string when the channel has no operations.
 */
const getOperationIds = (channel) => {
  const operations = channel.operations();
  const sendOperations = operations.filterBySend();
  const receiveOperations = operations.filterByReceive();
  return [...sendOperations, ...receiveOperations].map((operation) => operation.id()).join(', ');
};

module.exports = {
  getOperationMessages,
  getMessageExamples,
  getOperationIds,
};