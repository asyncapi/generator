
/**
 * Get messages related to the provided operation.
 * @param {object} operation - The AsyncAPI operation object. 
 * @throws {Error} If any of the parameter is missing or invalid.
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
   * @throws {Error} If any of the parameter is missing or invalid.
   */
  
function getMessageExamples(message) {
  if (!message) {
    throw new Error('Message object must be provided.');
  }
  const examples = message.examples();
  if (examples === undefined || examples.length === 0) {
    return null;
  }
  return examples;
}
  
module.exports = {
  getOperationMessages,
  getMessageExamples,
};