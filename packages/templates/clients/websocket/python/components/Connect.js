import { Text } from '@asyncapi/generator-react-sdk';

export function Connect({ title }) {
  return (
    <Text newLines={2} indent={2}>
      {
        `def on_open(self, ws):
    print("Connected to ${title} server")

def on_message(self, ws, message):
    self.handle_message(message)

def on_error(self, ws, error):
    print("WebSocket Error:", error)
    self.handle_error(error)

def on_close(self, ws, close_status_code, close_msg):
    print("Disconnected from ${title}", close_status_code, close_msg)

def connect(self):
    """Establish the connection and start the run_forever loop in a background thread."""
    ssl_opts = {"ca_certs": certifi.where()}
    self.ws_app = websocket.WebSocketApp(
        self.url,
        on_open=self.on_open,
        on_message=self.on_message,
        on_error=self.on_error,
        on_close=self.on_close
    )
    # Run the WebSocketApp's run_forever in a separate thread with multithreading enabled.
    def run():

        retry = 0
        max_retries = 5
        
        while not self._stop_event.is_set() and retry < max_retries:
            try:
                retry += 1
                print("Starting WebSocket thread...")
                self.ws_app.run_forever(sslopt=ssl_opts)
            except Exception as e:
                print(f"Exception in WebSocket thread: {e}")  # Print full error details

    thread = threading.Thread(target=run, daemon=True)
    thread.start()`
      }
    </Text>
  );
}
