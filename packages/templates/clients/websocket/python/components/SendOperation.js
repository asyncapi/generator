import { Text } from '@asyncapi/generator-react-sdk';

export function SendOperation({ sendOperations, clientName }) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }

  const toSnakeCase = (camelStr) => {
    return camelStr
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '');
  }; 

  return (
    <>
      {
        sendOperations.map((operation) => {
          const methodName = toSnakeCase(operation.id());
          const staticMethodName = `${methodName}_static`;
          
          return (
            <Text newLines={2} indent={2}>
              {`async def ${methodName}(self, message):
    """
    Send a ${methodName} message using the WebSocket connection attached to this instance.

    Args:
        message (dict or str): The message to send. Will be serialized to JSON if it's a dictionary.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    await self._send(message, self.ws_app)

@staticmethod
async def ${staticMethodName}(message, socket):
    """
    Send a ${methodName} message using a provided WebSocket connection, without needing an instance.

    Args:
        message (dict or str): The message to send.
        socket (websockets.WebSocketCommonProtocol): The WebSocket to send through.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    await ${clientName}._send(message, socket)
`}
            </Text>
          );
        })
      }
    </>
  );
}