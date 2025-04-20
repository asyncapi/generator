
/**
 * Get messages related to the provided operation.
 * @param {object} operation - The AsyncAPI operation object. 
 * @throws {Error} If any of the parameter is missing or invalid.
 * 
 * @returns messages resulting from operation
 */
function getOperationMessages(operation) {
  if (!operation) {
    throw new Error('Operation object must be provided.');
  }
  const messages = operation.messages().all();
  if (messages === undefined || messages.length === 0) {
    throw new Error('No messages found for the provided operation.');
  }
  return messages;
}
/**
 * Get examples related to the provided message.
 * @param {object} message 
 * @returns {Array} - An array of examples for the provided message.
 * @throws {Error} If any of the parameter is missing or invalid.
 */

function getMessageExamples(message) {
  if (!message) {
    throw new Error('Message object must be provided.');
  }
  const examples = message.examples();
  if (examples === undefined || examples.length === 0) {
    throw new Error('No examples found for the provided message.');
  }
  return examples;
}

module.exports = {
  getOperationMessages,
  getMessageExamples,
};