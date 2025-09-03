import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {'python' | 'javascript' | 'dart'} SupportedLanguage
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
  }
};

/**
 * Component that renders WebSocket onClose event handler for the specified programming language.
 * 
 * @param {Object} props - Component properties.
 * @param {SupportedLanguage} props.language - The programming language for which to generate onClose handler code.
 * @param {string} props.title - The title of the WebSocket server.
 */
export function OnClose({ language, title }) {
  let onCloseMethod = '';
  
  if (websocketOnCloseMethod[language]) {
    const generateOnCloseCode = websocketOnCloseMethod[language];
    const closeResult = generateOnCloseCode(title);
    onCloseMethod = closeResult.onCloseMethod;
  }

  return (
    <Text>
      {onCloseMethod}
    </Text>
  );
}