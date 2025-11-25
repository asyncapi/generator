import { Text } from '@asyncapi/generator-react-sdk';

/**
 * @typedef {import('../types').SupportedLanguage} SupportedLanguage
 * Supported programming languages for WebSocket onError handler generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket onError event handler implementations.
 * 
 * @type {Object.<SupportedLanguage, Function>}
 */
const websocketOnErrorMethod = {
  javascript: () => {
    return {
      onErrorMethod: `// On error first call custom error handlers, then default error behavior
    this.websocket.onerror = (error) => {
      if (this.errorHandlers.length > 0) {
        // Call custom error handlers
        this.errorHandlers.forEach(handler => handler(error));
      } else {
        // Default error behavior
        console.error('WebSocket Error:', error);
      }
      reject(error);
    };`
    };
  },
  python: () => {
    return {
      onErrorMethod: `def on_error(self, ws, error):
  print("WebSocket Error:", error)
  self.handle_error(error)`
    };
  },
  dart: () => {
    return {
      onErrorMethod: `onError: (error) {
        if (_errorHandlers.isNotEmpty) {
          for (var handler in _errorHandlers) {
            handler(error);
          }
        } else {
          print('WebSocket Error: $error');
        }
      },`
    };
  }
};

/**
 * Component that renders WebSocket onError event handler for the specified programming language.
 * 
 * @param {Object} props - Component properties.
 * @param {SupportedLanguage} props.language - The programming language for which to generate onError handler code.
 */
export function OnError({ language }) {
  let onErrorMethod = '';
  
  if (websocketOnErrorMethod[language]) {
    const generateErrorCode = websocketOnErrorMethod[language];
    const errorResult = generateErrorCode();
    onErrorMethod = errorResult.onErrorMethod;
  }

  return (
    <Text>
      {onErrorMethod}
    </Text>
  );
}