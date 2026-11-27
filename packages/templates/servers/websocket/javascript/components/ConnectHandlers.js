import { Text } from '@asyncapi/generator-react-sdk';

/**
 * Renders one connect handler for every send operation of a channel.
 * The generated server calls these handlers when a client connects to the channel.
 * Each handler is named by the operation's `operationId()`, the name `src/api/routes.js` imports it by.
 *
 * @param {object} props - Component props.
 * @param {object[]} props.operations - The send operations of the channel, in document order.
 * @returns {JSX.Element[]} One `Text` component per operation.
 */
export function ConnectHandlers({ operations }) {
  return operations.map((operation) => (
    <Text>
      {`
/**
 * ${operation.summary() || ''}
 * @param {object} ws WebSocket connection.
 */
service.${operation.operationId()} = async (ws) => {
  ws.send('Message from the server: Implement here your business logic that sends messages to a client after it connects.');
};`}
    </Text>
  ));
}
