import { Text } from '@asyncapi/generator-react-sdk';

/**
 * Renders the route of one channel: its route path and the handler called for each client that connects to it.
 * The route calls the handler of every send operation when a client connects,
 * and the handler of every receive operation for each message the client sends.
 *
 * @param {object} props - Component props.
 * @param {string} props.address - The address of the channel.
 * @param {object[]} props.sendOperations - The send operations of the channel, in document order.
 * @param {object[]} props.receiveOperations - The receive operations of the channel, in document order.
 * @returns {JSX.Element} A `Text` component with the `routes.set(...)` statement.
 */
export function Route({ address, sendOperations, receiveOperations }) {
  const routePath = address.startsWith('/') ? address : `/${address}`;
  const connectCalls = sendOperations
    .map((operation) => `\n  await ${operation.operationId()}(ws);`)
    .join('');
  const messageCalls = receiveOperations
    .map((operation) => `\n      await ${operation.operationId()}(ws, { message: msg, path, query });`)
    .join('');
  const messageListener = receiveOperations.length > 0
    ? `
  // Listening starts before the send handlers run, so a message the client sends meanwhile isn't lost.
  ws.on('message', async (data, isBinary) => {
    // ws passes every frame as a Buffer. A text frame goes to the handler as a string.
    const msg = isBinary ? data : data.toString();
    console.log(\`\${util.styleText('yellow', path)} message was received:\`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    try {${messageCalls}
    } catch (err) {
      console.error(err);
    }
  });`
    : '';

  return (
    <Text>
      {`routes.set('${routePath}', async (ws, { path, query }) => {
  console.log(\`\${util.styleText('yellow', path)} client connected.\`);${messageListener}${connectCalls}
});`}
    </Text>
  );
}
