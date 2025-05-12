import { Text } from '@asyncapi/generator-react-sdk';

export function SendOperation({ sendOperations, clientName }) {
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
 */
static ${operation.id()}(message, socket) {
  socket.send(JSON.stringify(message));
}
/**
 * Instance method version of ${operation.id()} that uses the client's own WebSocket connection.
 * @param {Object} message - The message payload to send
 */
${operation.id()}(message){
  ${clientName}.${operation.id()}(message, this.websocket);
}
  `}
        </Text>
      ))}
    </>
  );
}
