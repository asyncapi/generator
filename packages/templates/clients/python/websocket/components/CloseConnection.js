import { Text } from '@asyncapi/generator-react-sdk';

export function CloseConnection() {
  return (
    <Text indent={2}>
      {
        `def close(self):
    """Cleanly close the WebSocket connection."""
    self._stop_event.set()
    if self.ws_app:
        self.ws_app.close()
        print("WebSocket connection closed.")`
      }
    </Text>
  );
}
