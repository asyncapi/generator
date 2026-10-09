import { Text, render } from '@asyncapi/generator-react-sdk';
import { OnOpen } from './OnOpen';
import { OnMessage } from './OnMessage';
import { OnError } from './OnError';
import { OnClose } from './OnClose';
import { unsupportedLanguage } from '../utils/ErrorHandling';

type Language = 'python' | 'javascript' | 'dart';

interface ConnectResult {
  connectMethod: string;
}

type ConnectGenerator = (...args: string[]) => ConnectResult;

/**
 * Mapping of supported programming languages to their WebSocket connection method implementations.
 */
const websocketConnectMethod: Record<Language, ConnectGenerator> = {
  javascript: (onOpenMethod: string, onMessageMethod: string, onErrorMethod: string, onCloseMethod: string): ConnectResult => {
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
  python: (onOpenMethod: string, onMessageMethod: string, onErrorMethod: string, onCloseMethod: string): ConnectResult => {
    const onConnectMethod = `def connect(self):
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
    thread.start()`;
    return {
      connectMethod: `${onOpenMethod}
${onMessageMethod}
${onErrorMethod}
${onCloseMethod}
${onConnectMethod}`
    };
  },
  dart: (onMessageMethod: string, onErrorMethod: string, onCloseMethod: string, title: string): ConnectResult => {
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

interface ConnectProps {
  /** The programming language for which to generate connection code. */
  language: Language;
  /** The title of the WebSocket server. */
  title: string;
}

/**
 * Renders a WebSocket connection method for the specified programming language.
 *
 * @param props - Component props.
 * @returns A Text component containing the generated WebSocket connection code for the specified language.
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
export function Connect({ language, title }: ConnectProps): JSX.Element {
  const supportedLanguages = Object.keys(websocketConnectMethod);
  const generateConnectCode = websocketConnectMethod[language];

  if (!generateConnectCode) {
    throw unsupportedLanguage(language, supportedLanguages);
  }
  
  const onOpenMethod = language === 'dart'   ? ''  : render(<OnOpen language={language} title={title} />);
  const onMessageMethod = render(<OnMessage language={language} />);
  const onErrorMethod = render(<OnError language={language} />);
  const onCloseMethod = render(<OnClose language={language} title={title} />);

  let connectMethod: string;
  
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