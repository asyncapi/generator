import { Text } from '@asyncapi/generator-react-sdk';
import { toSnakeCase } from '@asyncapi/generator-helpers';

/**
 * @typedef {import('../types').SupportedLanguage} SupportedLanguage
 * Supported programming languages for WebSocket send operation generation.
 */

/**
 * Configuration object for generating WebSocket send operations for different languages.
 * @type {Object.<string, function(operation: Object, clientName: string): {nonStaticMethod: string, staticMethod: string}>}
 */
const websocketSendOperationConfig = {
  python: (operation, clientName) => {
    const methodName = toSnakeCase(operation.id());
    const staticMethodName = `${methodName}_static`;
    return {
      nonStaticMethod: `async def ${methodName}(self, message):
    """
    Send a ${methodName} message using the WebSocket connection attached to this instance.

    Args:
        message (dict or str): The message to send. Will be serialized to JSON if it's a dictionary.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    await self._send(message, self.ws_app)`,
      staticMethod: `@staticmethod
async def ${staticMethodName}(message, socket):
    """
    Send a ${methodName} message using a provided WebSocket connection, without needing an instance.

    Args:
        message (dict or str): The message to send.
        socket (websockets.WebSocketCommonProtocol): The WebSocket to send through.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    await ${clientName}._send(message, socket)`
    };
  },
  javascript: (operation, clientName) => {
    const methodName = operation.id();
    return {
      nonStaticMethod: `/**
 * Instance method version of ${methodName} that uses the client's own WebSocket connection.
 * @param {Object} message - The message payload to send
 * @throws {Error} If WebSocket connection is not established
 */
${methodName}(message){
  if(!this.websocket){
    throw new Error('WebSocket connection not established. Call connect() first.');
  }
  ${clientName}.${methodName}(message, this.websocket);
}`,
      staticMethod: `/**
 * Sends a ${methodName} message over the WebSocket connection.
 * 
 * @param {Object} message - The message payload to send. Should match the schema defined in the AsyncAPI document.
 * @param {WebSocket} [socket] - The WebSocket connection to use. If not provided, the client's own connection will be used.
 * @throws {TypeError} If message cannot be stringified to JSON
 * @throws {Error} If WebSocket connection is not in OPEN state
 */
static ${methodName}(message, socket) {
  try {
    socket.send(JSON.stringify(message));
  } catch (error) {
    console.error('Error sending ${methodName} message:', error);
  }
}`
    };
  }
};

/**
 * Component for rendering WebSocket send operation methods.
 * Generates both static and instance methods for sending messages through WebSocket connections.
 *
 * @param {Object} props - Component props.
 * @param {SupportedLanguage} props.language - The target programming language.
 * @param {Array<Object>} props.sendOperations - Array of send operations from AsyncAPI document.
 * @param {string} props.clientName - The name of the client class.
 */
export function SendOperations({ language, sendOperations, clientName }) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }  

  const generateSendOperationCode = websocketSendOperationConfig[language];

  return sendOperations.map((operation) => {
    const { nonStaticMethod, staticMethod } = generateSendOperationCode(operation, clientName);

    return (
      <>
        <Text indent={2} newLines={2}>
          {staticMethod}
        </Text>
        <Text indent={2} newLines={2}>
          {nonStaticMethod}
        </Text>
      </>
    );
  });
}