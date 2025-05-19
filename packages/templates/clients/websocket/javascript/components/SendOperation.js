import { Text } from '@asyncapi/generator-react-sdk';

export function SendOperation({ sendOperations, clientName }) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }

  return (
    <>
      {sendOperations.map((operation) => (
        <Text newLines={2} indent={2}>
          {`
/**
 * Sends a ${operation.id()} message over the WebSocket connection.
 * 
 * @param {Object} message - The message payload to send. Should match the schema defined in the AsyncAPI document.
 * @param {WebSocket} [socket] - The WebSocket connection to use. If not provided, the client's own connection will be used.
 * @throws {TypeError} If message cannot be stringified to JSON
 * @throws {Error} If WebSocket connection is not in OPEN state
 */
static ${operation.id()}(message, socket) {
  try {
    socket.send(JSON.stringify(message));
  } catch (error) {
    console.error('Error sending ${operation.id()} message:', error);
  }
}
/**
 * Instance method version of ${operation.id()} that uses the client's own WebSocket connection.
 * @param {Object} message - The message payload to send
 * @throws {Error} If WebSocket connection is not established
 */
${operation.id()}(message){
  if(!this.websocket){
    throw new Error('WebSocket connection not established. Call connect() first.');
  }
  ${clientName}.${operation.id()}(message, this.websocket);
}
  `}
        </Text>
      ))}
    </>
  );
}
