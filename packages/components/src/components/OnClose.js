import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedFramework, unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart' | 'java' } Language
 * Supported programming languages for WebSocket onClose handler generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket onClose event handler implementations.
 * 
 * @type {Object.<Language, Function|Object.<string, Function>>}
 */
const websocketOnCloseMethod = {
  javascript: (title) => {
    return {
      onCloseMethod: `// On connection close
    this.websocket.onclose = () => {
      console.log('Disconnected from ${title} server');
    };`
    };
  },
  python: (title) => {
    return {
      onCloseMethod: `def on_close(self, ws, close_status_code, close_msg):
  print("Disconnected from ${title}", close_status_code, close_msg)`
    };
  },
  dart: (title) => {
    return {
      onCloseMethod: `onDone: () {
        _channel = null;
        print('Disconnected from ${title} server');
      },`
    };
  },
  java: {
    quarkus: (title) => {
      const onCloseMethod = `
  @OnClose
  public void onClose(CloseReason reason, WebSocketClientConnection connection) {
    int code = reason.getCode();
    LOG.info("Websocket disconnected from ${title} with Close code: " + code);
  }
}`;
      return { onCloseMethod, indent: 0 };
    }
  }
};
/**
 * Resolves the appropriate onClose code generator for the given language and optional framework.
 *
 * @private
 * @param {Language} language - The target programming language.
 * @param {string} [framework=''] - Optional framework variant (e.g., 'quarkus' for java).
 * @returns {Function|undefined} The code generator function, or undefined if not found.
 */

const resolveCloseConfig = (language, framework = '') => {
  const config = websocketOnCloseMethod[language];
  if (typeof config === 'function') {
    return config;
  }
  if (framework && typeof config[framework] === 'function') {
    return config[framework];
  }
};

/**
 * Renders a WebSocket onClose event handler for the specified programming language.
 * 
 * @param {Object} props - Component props.
 * @param {Language} props.language - The programming language for which to generate onClose handler code.
 * @param {string} [props.framework=''] - Framework variant; required for framework-specific languages (e.g., 'quarkus' for java).
 * @param {string} props.title - The title of the WebSocket server.
 * 
 * @returns {JSX.Element} A Text component containing the onClose handler code for the specified language.
 * 
 * @example
 * const language = "java";
 * const framework = "quarkus";
 * const title = "HoppscotchEchoWebSocketClient";
 * 
 * function renderOnClose() {
 *  return (
 *    <OnClose 
 *       language={language} 
 *       framework={framework} 
 *       title={title}  
 *    />
 *  )
 * }
 * 
 * renderOnClose();
 */
export function OnClose({ language, framework = '', title }) {
  let onCloseMethod = '';
  let indent = 0;

  const supportedLanguages = Object.keys(websocketOnCloseMethod);

  if (!websocketOnCloseMethod[language]) {
    throw unsupportedLanguage(language, supportedLanguages);
  }
  
  const generateOnCloseCode = resolveCloseConfig(language, framework);

  if (typeof generateOnCloseCode !== 'function') {
    throw unsupportedFramework(language, framework, ['quarkus']);
  }

  const closeResult = generateOnCloseCode(title);
  onCloseMethod = closeResult.onCloseMethod;
  indent = closeResult.indent ?? 0;

  return (
    <Text indent={indent}>
      {onCloseMethod}
    </Text>
  );
}