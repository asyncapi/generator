/**
 * Extracts all message example payloads from an AsyncAPI operation.
 *
 * @param {object} operation - The AsyncAPI operation object.
 *
 * @returns {Array<object>} - An array of example payloads extracted from messages. Returns an empty array if no examples are found.
 * @throws {Error} - Throws an error if the operation object is not provided.
 */
function getOperationMessageExamplePayloads(operation) {
  if (!operation) {
    throw new Error('Operation object must be provided.');
  }
  const channels = operation.channels().all();
  if (channels.length === 0) return [];

  const messages = channels.flatMap(channel => channel.messages().all());
  if (messages.length === 0) return [];

  const examples = messages.flatMap(message => message.examples?.() || []);

  // filter out any undefined/null results, for example if the payload is not defined
  return examples.map(example => example.payload()).filter(Boolean);
};

module.exports = {
  getOperationMessageExamplePayloads
};