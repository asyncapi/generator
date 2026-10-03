import { Text } from '@asyncapi/generator-react-sdk';

const RESERVED_METHOD_NAMES = new Set([
  'constructor',
  'compileOperationSchemas',
  'registerMessageHandler',
  'registerErrorHandler',
  'registerConnectionHandler',
  'matchChannel',
  'handleConnection',
  'handleError',
  'broadcast',
  'start',
  'stop'
]);

/**
 * Renders outbound send and broadcast methods for the server.
 *
 * @param {Object} props Component props.
 * @param {Array<Object>} props.sendOperations List of send operations with id and channel address.
 * @returns {JSX.Element} Send operations code.
 */
export function SendOperations({ sendOperations = [] }) {
  const operationsCode = sendOperations.map(op => {
    const opId = op.id;
    if (RESERVED_METHOD_NAMES.has(opId)) {
      throw new Error(`Operation ID "${opId}" conflicts with reserved WebSocketServer method name.`);
    }

    const channelAddress = op.channelAddress || '/';

    return `  /**
   * Send validated message for operation ${JSON.stringify(opId)}.
   *
   * @param {any} payload Message payload.
   * @param {WebSocket} [targetWs=null] Optional target client. If omitted, broadcasts to channel.
   * @returns {Promise<boolean|number>} True if sent to target, or count of broadcast recipients.
   */
  async [${JSON.stringify(opId)}](payload, targetWs = null) {
    const validators = this.compiledSchemas[${JSON.stringify(opId)}];
    if (validators && validators.length > 0) {
      let passed = false;
      let validationErrors = null;
      for (const validator of validators) {
        const result = validateMessage(validator, payload);
        if (result.isValid) {
          passed = true;
          break;
        } else {
          validationErrors = result.validationErrors;
        }
      }
      if (!passed) {
        const err = new Error(\`Outbound message validation failed for operation \${${JSON.stringify(JSON.stringify(opId))}}\`);
        err.validationErrors = validationErrors;
        throw err;
      }
    }

    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    if (targetWs) {
      targetWs.send(data);
      return true;
    }
    return this.broadcast(${JSON.stringify(channelAddress)}, payload);
  }`;
  }).join('\n\n');

  return (
    <Text indent={2} newLines={2}>
      {`/**
   * Broadcasts a payload to all connected clients on a given channel address.
   *
   * @param {string} channelAddress Target channel address.
   * @param {any} payload Message payload to send.
   * @returns {number} Number of clients the message was sent to.
   */
  broadcast(channelAddress, payload) {
    const channel = this.channels[channelAddress];
    if (!channel) {
      throw new Error(\`Channel "\${channelAddress}" does not exist on this server.\`);
    }

    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    let sentCount = 0;
    for (const client of channel.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
        sentCount++;
      }
    }
    return sentCount;
  }

${operationsCode}`}
    </Text>
  );
}
