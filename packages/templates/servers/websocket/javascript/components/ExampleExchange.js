import { Text } from '@asyncapi/generator-react-sdk';
import { getMessageExamples, getOperationMessages } from '@asyncapi/generator-helpers';

/**
 * Picks the message that the example sends for one receive operation:
 * the first example of the operation's first message, or a placeholder when the document has none.
 *
 * @param {object} operation - The AsyncAPI receive operation.
 * @returns {string} The message, as the text that goes over the connection.
 */
function exampleMessage(operation) {
  const placeholder = `TODO: replace with a message for ${operation.id()}`;
  const messages = getOperationMessages(operation);
  if (!messages) {
    return placeholder;
  }
  const examples = getMessageExamples(messages[0]);
  if (!examples) {
    return placeholder;
  }
  const payload = examples.all()[0].payload();
  return typeof payload === 'string' ? payload : JSON.stringify(payload);
}

/**
 * Renders the call in `example.js` that talks to one channel of the generated server:
 * it connects to the channel and sends one message for every receive operation of the channel.
 *
 * @param {object} props - Component props.
 * @param {string} props.address - The address of the channel.
 * @param {object[]} props.receiveOperations - The receive operations of the channel, in document order.
 * @returns {JSX.Element} A `Text` component with the `exchangeMessages(...)` call.
 */
export function ExampleExchange({ address, receiveOperations }) {
  const routePath = address.startsWith('/') ? address : `/${address}`;
  // JSON.stringify writes each message as a JavaScript string literal, with every quote and line break escaped.
  const messages = receiveOperations.map((operation) => JSON.stringify(exampleMessage(operation))).join(', ');

  return (
    <Text indent={2}>
      {`await exchangeMessages('${routePath}', [${messages}]);`}
    </Text>
  );
}
