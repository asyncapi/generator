import { Text } from '@asyncapi/generator-react-sdk';
import { Constructor } from './Constructor';
import { CompileOperationSchemas } from './CompileOperationSchemas';
import { RouteHandlers } from './RouteHandlers';
import { SendOperations } from './SendOperations';
import { ServerLifecycle } from './ServerLifecycle';

/**
 * Top-level component rendering the complete WebSocketServer class and bootstrap exports.
 *
 * @param {Object} props Component props.
 * @param {Array<Object>} props.channelsInfo Parsed channel details.
 * @param {Array<string>} props.receiveOps Receive operation IDs.
 * @param {Array<string>} props.sendOps Send operation IDs.
 * @param {Array<string>} props.allOps All operation IDs.
 * @param {Array<Object>} props.sendOperations Full send operation details.
 * @param {string} props.defaultPort Default server port.
 * @returns {JSX.Element} Server class code.
 */
export function ServerClass({ channelsInfo = [], receiveOps = [], sendOps = [], allOps = [], sendOperations = [], defaultPort = '8080' }) {
  return (
    <Text>
      <Text newLines={2}>
        {'class WebSocketServer {'}
      </Text>
      <Constructor
        channelsInfo={channelsInfo}
        receiveOps={receiveOps}
        sendOps={sendOps}
        allOps={allOps}
        defaultPort={defaultPort}
      />
      <CompileOperationSchemas allOps={allOps} />
      <RouteHandlers />
      <SendOperations sendOperations={sendOperations} />
      <ServerLifecycle />
      <Text newLines={2}>
        {'}'}
      </Text>
      <Text newLines={2}>
        {`/**
 * Creates and returns a new WebSocketServer instance.
 *
 * @param {Object} [options] Server options.
 * @returns {WebSocketServer}
 */
function createServer(options) {
  return new WebSocketServer(options);
}

module.exports = {
  WebSocketServer,
  createServer
};

if (require.main === module) {
  const server = new WebSocketServer();
  server.start().catch((err) => {
    console.error('Failed to start WebSocket server:', err);
    process.exit(1);
  });
}`}
      </Text>
    </Text>
  );
}
