import { Text } from '@asyncapi/generator-react-sdk';

export function Constructor({ serverUrl }) {
  return (
    <Text indent={2} newLines={2}>
      {
        `def __init__(self):
    self.url = "${serverUrl}"
    self.ws_app = None  # Instance of WebSocketApp
    self.message_handlers = []      # Callables for incoming messages
    self.error_handlers = []        # Callables for errors
    self.outgoing_processors = []   # Callables to process outgoing messages
    self._stop_event = threading.Event()`
      }
    </Text>
  );
}
