import { File } from '@asyncapi/generator-react-sdk';
import { getOperationIds, kebabCase } from '@asyncapi/generator-helpers';

/**
 * Renders the route of one channel: its route path and the handler called for each client that connects to it.
 *
 * @param {object} channel - The AsyncAPI channel object. It must have an address.
 * @returns {string} The `routes.set(...)` statement, ending with a line break.
 */
function renderRoute(channel) {
  const address = channel.address();
  const routePath = address.startsWith('/') ? address : `/${address}`;

  // Why: the source template was written for the AsyncAPI 2.x API. It called the `subscribe` handler when a client
  // connects and the `publish` handler for each message. A 2.x `subscribe` is what the application sends and
  // a 2.x `publish` is what it receives, so these are the channel's first send and first receive operation.
  const sendOperations = channel.operations().filterBySend();
  const receiveOperations = channel.operations().filterByReceive();

  const callSendHandler = sendOperations.length > 0
    ? `\n  await ${sendOperations[0].operationId()}(ws);`
    : '';
  const listenForMessages = receiveOperations.length > 0
    ? `
  ws.on('message', async (data, isBinary) => {
    // ws passes every frame as a Buffer. A text frame goes to the handler as a string.
    const msg = isBinary ? data : data.toString();
    console.log(\`\${util.styleText('yellow', path)} message was received:\`);
    console.log(util.inspect(msg, { depth: null, colors: true }));
    await ${receiveOperations[0].operationId()}(ws, { message: msg, path, query });
  });`
    : '';

  return `routes.set('${routePath}', async (ws, { path, query }) => {
  console.log(\`\${util.styleText('yellow', path)} client connected.\`);${callSendHandler}${listenForMessages}
});
`;
}

/**
 * Generates `src/api/routes.js`, which exports a `Map` of route path to connection handler, one entry per channel.
 *
 * @param {object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @returns {JSX.Element} A `File` component containing the generated routes.
 * @throws {Error} If a send or receive operation that a route calls has no operationId.
 */
export default function ({ asyncapi }) {
  // Why: an AsyncAPI 3 channel may have no address (`address: null`, or no `address` field). Such a channel
  // has no path a client can connect to, so it gets no route here, as it gets no service file.
  const channels = asyncapi.channels().all().filter((channel) => {
    const address = channel.address();
    return address !== null && address !== undefined;
  });

  // The service file of a channel is named `kebabCase(channel.id())`, so the path required here is built the same way.
  const serviceRequires = channels
    .map((channel) => `\nconst { ${getOperationIds(channel)} } = require('./services/${kebabCase(channel.id())}');`)
    .join('');
  const routes = channels.map(renderRoute).join('');

  return (
    <File name="routes.js">
      {`const util = require('util');${serviceRequires}
const routes = new Map();
module.exports = routes;
${routes}`}
    </File>
  );
}
