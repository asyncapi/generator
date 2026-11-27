import { Text } from '@asyncapi/generator-react-sdk';
import { docline, getOperationMessages } from '@asyncapi/generator-helpers';

/**
 * Builds the JSDoc `@param` lines for the properties of a message's headers or payload schema.
 *
 * @param {object} schema - The AsyncAPI schema object, or `undefined` when the message has none.
 * @param {string} scopePropName - The JSDoc name of the parameter that holds the properties, e.g. `options.message.payload`.
 * @returns {string[]} One JSDoc line per property.
 */
function propertyDoclines(schema, scopePropName) {
  if (!schema) {
    return [];
  }
  // Why: the Parser returns `undefined`, not an empty map, for a schema without `properties`.
  const properties = schema.properties() || {};
  return Object.entries(properties).map(([fieldName, field]) => docline(field, fieldName, scopePropName));
}

/**
 * Builds the JSDoc lines that document every message of a receive operation:
 * the payload type of the message, then its header properties, then its payload properties.
 *
 * @param {object} operation - The AsyncAPI receive operation.
 * @returns {string[]} The JSDoc lines. Empty when the operation has no message.
 */
function messageDoclines(operation) {
  const messages = getOperationMessages(operation) || [];
  return messages.flatMap((message) => {
    // The payload type is read without checking that the message has a payload, as the source template read it:
    // generation fails for a message without one.
    const payload = message.payload();
    return [
      // A payload schema without a type accepts any value, which JSDoc writes as `*`.
      ` * @param {${payload.type() || '*'}} options.message The received message.`,
      ...propertyDoclines(message.headers(), 'options.message.headers'),
      ...propertyDoclines(payload, 'options.message.payload')
    ];
  });
}

/**
 * Renders one message handler for every receive operation of a channel.
 * The generated server calls all of these handlers for each message a client sends on the channel.
 * Each handler is named by the operation's `operationId()`, the name `src/api/routes.js` imports it by.
 *
 * @param {object} props - Component props.
 * @param {object[]} props.operations - The receive operations of the channel, in document order.
 * @returns {JSX.Element[]} One `Text` component per operation.
 */
export function MessageHandlers({ operations }) {
  return operations.map((operation) => {
    const messageDocs = messageDoclines(operation).map((line) => `\n${line}`).join('');

    return (
      <Text>
        {`
/**
 * ${operation.summary() || ''}
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.path The path in which the message was received.
 * @param {object} options.query The query parameters used when connecting to the server.${messageDocs}
 */
service.${operation.operationId()} = async (ws, { message, path, query }) => {
  ws.send('Message from the server: Implement here your business logic that reacts on messages sent from a client.');
};`}
      </Text>
    );
  });
}
