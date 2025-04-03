import { Text } from '@asyncapi/generator-react-sdk';

export function Constructor({ serverUrl }) {
  return (
    <Text indent={2} newLines={2}>
      {
        `def __init__(self, url: str = "${serverUrl}"):
    """
    Constructor to initialize the WebSocket client.

    Args:
        url (str, optional): The WebSocket server URL. Use it if the server URL is 
        different from the default one taken from the AsyncAPI document.
    """
    self.url = url
    self.ws_app = None  # Instance of WebSocketApp
    self.message_handlers = []      # Callables for incoming messages
    self.error_handlers = []        # Callables for errors
    self.outgoing_processors = []   # Callables to process outgoing messages
    self._stop_event = threading.Event()`
      }
    </Text>
  );
}
