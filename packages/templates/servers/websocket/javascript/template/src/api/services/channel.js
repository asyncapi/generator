import { File } from '@asyncapi/generator-react-sdk';
import { kebabCase, docline, getOperationMessages } from '@asyncapi/generator-helpers';

/**
 * Builds the JSDoc `@param` lines for the properties of a message's headers or payload schema.
 *
 * @param {object} schema - The AsyncAPI schema object, or `undefined` when the message has none.
 * @param {string} scopePropName - The JSDoc name of the parameter that holds the properties, e.g. `options.message.payload`.
 * @returns {string} The lines, each one starting on a new line, or an empty string when there is nothing to document.
 */
function propertyDoclines(schema, scopePropName) {
  if (!schema) {
    return '';
  }
  // Why: the Parser returns `undefined`, not an empty map, for a schema without `properties`.
  const properties = schema.properties() || {};
  return Object.entries(properties)
    .map(([fieldName, field]) => `\n${docline(field, fieldName, scopePropName)}`)
    .join('');
}

/**
 * Builds the handler that the generated server calls when a client connects.
 * Its name is the operation's `operationId()`, the name `src/api/routes.js` imports it by.
 *
 * @param {object} operation - The AsyncAPI send operation of the channel.
 * @returns {string} The JSDoc block and the handler, starting on a new line.
 */
function connectHandler(operation) {
  return `
/**
 * ${operation.summary() || ''}
 * @param {object} ws WebSocket connection.
 */
service.${operation.operationId()} = async (ws) => {
  ws.send('Message from the server: Implement here your business logic that sends messages to a client after it connects.');
};`;
}

/**
 * Builds the handler that the generated server calls for each message a client sends.
 * Its name is the operation's `operationId()`, the name `src/api/routes.js` imports it by.
 *
 * @param {object} operation - The AsyncAPI receive operation of the channel.
 * @returns {string} The JSDoc block and the handler, starting on a new line.
 */
function messageHandler(operation) {
  const message = (getOperationMessages(operation) || [])[0];
  // The payload type is read without checking that the operation has a message with a payload, as the source
  // template read it: generation fails for a receive operation without one.
  const payload = message.payload();
  const headers = message.headers();
  return `
/**
 * ${operation.summary() || ''}
 * @param {object} ws WebSocket connection.
 * @param {object} options
 * @param {string} options.path The path in which the message was received.
 * @param {object} options.query The query parameters used when connecting to the server.
 * @param {${payload.type() || ''}} options.message The received message.${propertyDoclines(headers, 'options.message.headers')}${propertyDoclines(payload, 'options.message.payload')}
 */
service.${operation.operationId()} = async (ws, { message, path, query }) => {
  ws.send('Message from the server: Implement here your business logic that reacts on messages sent from a client.');
};`;
}

/**
 * Generates one service file per channel, with the handlers of the channel's operations.
 *
 * @param {object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @returns {JSX.Element[]} One `File` component for each channel that has an address.
 */
export default function ({ asyncapi }) {
  // Why: an AsyncAPI 3 channel can have no address (`address: null`, or no `address` field). Such a channel has
  // no route in `src/api/routes.js`, so it gets no service file either.
  const channels = asyncapi.channels().all().filter((channel) => {
    const address = channel.address();
    return address !== null && address !== undefined;
  });

  return channels.map((channel) => {
    const operations = channel.operations();
    // Why: the source template was written for AsyncAPI 2.x, where `subscribe` is what the application sends and
    // `publish` what it receives. Each kind gets one handler per channel, as before: the one of its first operation.
    const sendOperations = operations.filterBySend();
    const receiveOperations = operations.filterByReceive();
    const onConnect = sendOperations.length > 0 ? connectHandler(sendOperations[0]) : '';
    const onMessage = receiveOperations.length > 0 ? messageHandler(receiveOperations[0]) : '';
    // `src/api/routes.js` requires the file by this same name.
    const fileName = `${kebabCase(channel.id())}.js`;

    return (
      <File name={fileName} key={channel.id()}>
        {`const service = module.exports = {};
${onConnect}${onMessage}
`}
      </File>
    );
  });
}
