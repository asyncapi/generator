import { Text } from '@asyncapi/generator-react-sdk';

/**
 * Renders the constructor for WebSocketServer class.
 *
 * @param {Object} props Component props.
 * @param {Array<Object>} props.channelsInfo Channel information including address and operation IDs.
 * @param {Array<string>} props.receiveOps Receive operation IDs.
 * @param {Array<string>} props.sendOps Send operation IDs.
 * @param {Array<string>} props.allOps All operation IDs.
 * @param {string} props.defaultPort Default port to listen on.
 * @returns {JSX.Element} Constructor code component.
 */
export function Constructor({ channelsInfo = [], receiveOps = [], sendOps = [], allOps = [], defaultPort = '8080' }) {
  const channelsSerialized = JSON.stringify(
    channelsInfo.reduce((acc, ch) => {
      acc[ch.address] = {
        address: ch.address,
        operations: {
          receive: ch.receiveOps || [],
          send: ch.sendOps || []
        }
      };
      return acc;
    }, {}),
    null,
    6
  );

  return (
    <Text indent={2} newLines={2}>
      {`constructor(options = {}) {
    this.port = options.port || process.env.PORT || ${JSON.stringify(defaultPort)};
    this.host = options.host || '0.0.0.0';
    this.asyncapiFilepath = options.asyncapiFilepath || asyncapiFilepath;
    this.server = null;
    this.wss = null;
    this.compiledSchemas = {};
    this.schemasCompiled = false;
    this.messageHandlers = {};
    this.errorHandlers = [];
    this.connectionHandlers = [];

    const channelDefinitions = ${channelsSerialized};

    this.channels = {};
    for (const [address, def] of Object.entries(channelDefinitions)) {
      this.channels[address] = {
        ...def,
        clients: new Set()
      };
    }

    this.receiveOperationIds = ${JSON.stringify(receiveOps)};
    this.sendOperationIds = ${JSON.stringify(sendOps)};
    this.allOperationIds = ${JSON.stringify(allOps)};
  }`}
    </Text>
  );
}
