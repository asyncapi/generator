import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {import('../types').SupportedLanguage} SupportedLanguage
 * Supported programming languages for WebSocket onClose handler generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket onClose event handler implementations.
 * 
 * @type {Object.<SupportedLanguage, Function>}
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
 * Component that renders WebSocket onClose event handler for the specified programming language.
 * 
 * @param {Object} props - Component properties.
 * @param {SupportedLanguage} props.language - The programming language for which to generate onClose handler code.
 * @param {string} [props.framework=''] - Optional framework variant (e.g., 'quarkus' for java).
 * @param {string} props.title - The title of the WebSocket server.
 */
export function OnClose({ language, framework = '', title }) {
  let onCloseMethod = '';
  let indent = 0;

  if (websocketOnCloseMethod[language]) {
    const generateOnCloseCode = resolveCloseConfig(language, framework);
    const closeResult = generateOnCloseCode(title);
    onCloseMethod = closeResult.onCloseMethod;
    indent = closeResult.indent ?? 0;
  }

  return (
    <Text indent={indent}>
      {onCloseMethod}
    </Text>
  );
}