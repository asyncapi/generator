import { Text } from '@asyncapi/generator-react-sdk';

export function Send({ sendOperations }) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }

  return (
    <Text newLines={2} indent={2}>
      {
        `
@staticmethod
async def _send(message, socket):
    """
    Internal helper to handle the actual sending logic.

    Args:
        message (dict or str): The message to send.
        socket (websockets.WebSocketCommonProtocol): The WebSocket to send through.

    Notes:
        If message is a dictionary, it will be automatically converted to JSON.
    """
    try:
        if isinstance(message, dict):
            message = json.dumps(message)
        await socket.send(message)
    except Exception as e:
        print("Error sending:", e)`
      }
    </Text>
  );
}
