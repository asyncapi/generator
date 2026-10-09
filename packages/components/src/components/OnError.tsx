import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../utils/ErrorHandling';

type Language = 'python' | 'javascript' | 'dart';

interface OnErrorResult {
  onErrorMethod: string;
}

/**
 * Mapping of supported programming languages to their WebSocket onError event handler implementations.
 */
const websocketOnErrorMethod: Record<Language, () => OnErrorResult> = {
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
        _handleError(error);
      },`
    };
  }
};

interface OnErrorProps {
  /** The programming language for which to generate onError handler code. */
  language: Language;
}

/**
 * Renders a WebSocket onError event handler for the specified programming language.
 *
 * @param props - Component props.
 * @returns A Text component containing the onError handler code for the specified language.
 * @throws When the specified language is not supported.
 *
 * @example
 * import { OnError } from "@asyncapi/generator-components";
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
export function OnError({ language }: OnErrorProps): JSX.Element {
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