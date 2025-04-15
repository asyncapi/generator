import { Text } from '@asyncapi/generator-react-sdk';

export function SendEchoMessage() {
  return (
    <Text newLines={2} indent={2}>
      {
        `async def send_message(self, message):
    """
    Send a message using the WebSocket connection attached to this instance.

    Args:
        message (dict or str): The message to send. Will be serialized to JSON if it's a dictionary.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    await self._send(message, self.ws_app)

@staticmethod
async def send_message_static(message, socket):
    """
    Send a message using a provided WebSocket connection, without needing an instance.

    Args:
        message (dict or str): The message to send.
        socket (websockets.WebSocketCommonProtocol): The WebSocket to send through.

    Raises:
        Exception: If sending fails or the socket is not connected.
    """
    await HoppscotchEchoWebSocketClient._send(message, socket)

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
