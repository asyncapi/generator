import { Text, render } from '@asyncapi/generator-react-sdk';
import { OnOpen } from './OnOpen';
import { OnMessage } from './OnMessage';
import { OnError } from './OnError';
import { OnClose } from './OnClose';
import { unsupportedLanguage } from '../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for WebSocket connection method generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket connection method implementations.
 * 
 * @type {Object.<Language, Function>}
 */
const websocketConnectMethod = {
  javascript: (onOpenMethod, onMessageMethod, onErrorMethod, onCloseMethod) => {
    return {
      connectMethod: `// Method to establish a WebSocket connection
connect() {
    return new Promise((resolve, reject) => {
        this.websocket = new WebSocket(this.url);
        ${onOpenMethod}
        ${onMessageMethod}
        ${onErrorMethod}
        ${onCloseMethod}
    });
}`
    };
  },
  python: (onOpenMethod, onMessageMethod, onErrorMethod, onCloseMethod) => {
    const onConnectMethod = `def connect(self):
    """Establish the connection and start the run_forever loop in a background thread."""
    ssl_opts = {"ca_certs": certifi.where()}
    stop_event = threading.Event()
    attempt_socket = None
    previous_timeout = None

    def handshake_headers():
        nonlocal attempt_socket, previous_timeout
        with self._connection_lock:
            # run_forever resets keep_running before starting the handshake.
            if stop_event.is_set():
                raise websocket.WebSocketException("WebSocket connection was cancelled")
            attempt_socket = ws_app.sock
            previous_timeout = attempt_socket.gettimeout()
            # Bound stalled handshakes without changing the established connection timeout.
            if previous_timeout is None or previous_timeout > 5:
                attempt_socket.settimeout(5)
        return {}

    def on_open(ws):
        if stop_event.is_set():
            ws.close()
            return
        attempt_socket.settimeout(previous_timeout)
        self.on_open(ws)

    def on_message(ws, message):
        if not stop_event.is_set():
            self.on_message(ws, message)

    def on_error(ws, error):
        if not stop_event.is_set():
            self.on_error(ws, error)

    def on_close(ws, code, reason):
        if self.ws_app is ws:
            self.on_close(ws, code, reason)

    with self._connection_lock:
        if self.ws_app is not None and not self._stop_event.is_set():
            return
        ws_app = websocket.WebSocketApp(
            self.url,
            header=handshake_headers,
            on_open=on_open,
            on_message=on_message,
            on_error=on_error,
            on_close=on_close
        )
        self.ws_app = ws_app
        self._stop_event = stop_event

    def run():
        retry = 0
        max_retries = 5
        try:
            # Keep this worker tied to its own connection, even after reconnecting.
            while not stop_event.is_set() and retry < max_retries:
                try:
                    retry += 1
                    print("Starting WebSocket thread...")
                    ws_app.run_forever(sslopt=ssl_opts)
                except Exception as e:
                    print(f"Exception in WebSocket thread: {e}")  # Print full error details
        finally:
            # close() can detach the app's socket before its handshake finishes.
            try:
                if attempt_socket is not None:
                    attempt_socket.shutdown()
            finally:
                stop_event.set()

    thread = threading.Thread(target=run, daemon=True)
    thread.start()`;
    return {
      connectMethod: `${onOpenMethod}
${onMessageMethod}
${onErrorMethod}
${onCloseMethod}
${onConnectMethod}`
    };
  },
  dart: (onMessageMethod, onErrorMethod, onCloseMethod, title) => {
    return {
      connectMethod: `/// Method to establish a WebSocket connection
Future<void> connect() async {
    if (_channel != null) {
        print('Already connected to ${title} server');
        return;
    }
    try {
        final wsUrl = Uri.parse(_url);
        _channel = WebSocketChannel.connect(wsUrl);
        print('Connected to ${title} server');
        /// Listen to the incoming message stream
        _channel?.stream.listen(
        ${onMessageMethod}
        ${onErrorMethod}
        ${onCloseMethod}
    );   
  } catch (error) {
    print('Connection failed: $error');
    rethrow;
  }
}`
    };
  }
};

/**
 * Renders a WebSocket connection method for the specified programming language.
 * 
 * @param {Object} props - Component props.
 * @param {Language} props.language - The programming language for which to generate connection code.
 * @param {string} props.title - The title of the WebSocket server.
 * @return {JSX.Element} A Text component containing the generated WebSocket connection code for the specified language.
 * @throws When the specified language is not supported.
 * 
 * @example
 * import { Connect } from "@asyncapi/generator-components";
 * const language = "python";
 * const title = "HoppscotchEchoWebSocketClient";
 * 
 * function renderConnect() {
 *   return(
 *    <Connect 
 *        language={language} 
 *        title={title} 
 *    />
 *   )
 * }
 * 
 * renderConnect();
 */
export function Connect({ language, title }) {
  const supportedLanguages = Object.keys(websocketConnectMethod);
  const generateConnectCode = websocketConnectMethod[language];

  if (!generateConnectCode) {
    throw unsupportedLanguage(language, supportedLanguages);
  }
  
  const onOpenMethod = language === 'dart'   ? ''  : render(<OnOpen language={language} title={title} />);
  const onMessageMethod = render(<OnMessage language={language} />);
  const onErrorMethod = render(<OnError language={language} />);
  const onCloseMethod = render(<OnClose language={language} title={title} />);

  let connectMethod;
  
  if (language === 'dart') {
    const result = generateConnectCode(onMessageMethod, onErrorMethod, onCloseMethod, title);
    connectMethod = result.connectMethod;
  } else {
    const result = generateConnectCode(onOpenMethod, onMessageMethod, onErrorMethod, onCloseMethod);
    connectMethod = result.connectMethod;
  }

  return (
    <Text newLines={2} indent={2}>
      {connectMethod}
    </Text>
  );
}