
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
 * Get the operationId of an operation that must have one.
 *
 * @param {object} operation - The AsyncAPI operation object.
 * @throws {Error} If the operation has no operationId.
 *
 * @returns {string} The operationId.
 */
const getRequiredOperationId = (operation) => {
  // Why: `operationId()`, not `id()`. For an AsyncAPI 2.x operation without an operationId the Parser's `id()`
  // falls back to the action name (`subscribe` or `publish`), which would hide the missing operationId.
  const operationId = operation.operationId();
  if (!operationId) {
    throw new Error('This template requires operationId to be set in every operation.');
  }
  return operationId;
};

/**
 * Get the operation ids of a channel as one comma separated string:
 * the id of its first send operation, then the id of its first receive operation.
 *
 * @param {object} channel - The AsyncAPI channel object.
 * @throws {Error} If one of these operations has no operationId.
 *
 * @returns {string} The operation ids joined with `, `, or an empty string when the channel has neither operation.
 */
const getOperationIds = (channel) => {
  const operations = channel.operations();
  // Why: the order is send, then receive. This helper replaces a filter written for the AsyncAPI 2.x API that listed
  // `subscribe` before `publish`: a 2.x `subscribe` is what the application sends, and `publish` what it receives.
  const sendOperations = operations.filterBySend();
  const receiveOperations = operations.filterByReceive();
  const operationIds = [];
  if (sendOperations.length > 0) {
    operationIds.push(getRequiredOperationId(sendOperations[0]));
  }
  if (receiveOperations.length > 0) {
    operationIds.push(getRequiredOperationId(receiveOperations[0]));
  }
  return operationIds.join(', ');
};

module.exports = {
  getOperationMessages,
  getMessageExamples,
  getOperationIds,
};