import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for WebSocket onError handler generation.
 */

/**
 * Mapping of supported programming languages to their WebSocket onError event handler implementations.
 * 
 * @type {Object.<Language, Function>}
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
 * Renders a WebSocket onError event handler for the specified programming language.
 * 
 * @param {Object} props - Component props.
 * @param {Language} props.language - The programming language for which to generate onError handler code.
 * @returns {JSX.Element} A Text component containing the onError handler code for the specified language.
 * 
 * @example
 * const language = "javascript";
 * 
 * function renderOnError() {
 *   return (
 *     <OnError language={language} />
 *   )
 * }
 * 
 * renderOnError();
 */
export function OnError({ language }) {
  const supportedLanguages = Object.keys(websocketOnErrorMethod);
  
  const generateErrorCode = websocketOnErrorMethod[language];

  if (!generateErrorCode) {
    throw unsupportedLanguage(language, supportedLanguages);
  }
  
  const errorResult = generateErrorCode();
  const { onErrorMethod } = errorResult;
  
  return (
    <Text>
      {onErrorMethod}
    </Text>
  );
}