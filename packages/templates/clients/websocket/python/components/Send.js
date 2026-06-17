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
def _send(message, socket):
    """
    Internal helper that performs the actual send.

    This is the low-level send primitive: it serializes the message if needed
    and writes it to the socket. It does NOT swallow errors -- any failure is
    propagated to the caller, which decides how to handle it (the instance
    send_* methods route failures through the registered error handlers and
    honour the raise_send_errors flag; the static send_*_static methods
    let the exception propagate directly).

    Args:
        message (dict or str): The message to send. A dict is serialized to JSON.
        socket (websockets.WebSocketCommonProtocol): The WebSocket to send through.

    Raises:
        Exception: Propagates any error raised while serializing the message or
            sending it (for example when the socket is not connected).
    """
    if isinstance(message, dict):
        message = json.dumps(message)
    socket.send(message)`
      }
    </Text>
  );
}
