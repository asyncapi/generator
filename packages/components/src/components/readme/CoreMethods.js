import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript'} Language
 * Supported programming languages.
 */

const methodConfig = {
  python: {
    msgHandler: 'register_message_handler(handler_function)',
    errHandler: 'register_error_handler(handler_function)',
  },
  javascript: {
    msgHandler: 'registerMessageHandler(handlerFunction)',
    errHandler: 'registerErrorHandler(handlerFunction)',
  },
};

/**
 * Renders a list of core WebSocket client methods for a given target language.
 * @param {Object} props - Component props 
 * @param {Language} props.language - Target language used to select method names.
 * @returns {JSX.Element} A Text component that contains a list of core client methods.
 * @throws {Error} When an unsupported language is provided.
 * 
 * @example
 * const language = "javascript";
 * 
 * function renderCoreMethods() {
 *   return (
 *     <CoreMethods language={language} />
 *   )
 * }
 * 
 * renderCoreMethods();
 */

export function CoreMethods({ language }) {
  const supportedLanguages = Object.keys(methodConfig);
  const config = methodConfig[language];
  
  if (!config) {
    unsupportedLanguage(language, supportedLanguages);
  }

  const { msgHandler, errHandler } = config;

  return (
    <Text newLines={2}>
      {`## API

### \`connect()\`
Establishes a WebSocket connection.

### \`${msgHandler}\`
Registers a callback for incoming messages.

### \`${errHandler}\`
Registers a callback for connection errors.

### \`close()\`
Closes the WebSocket connection.
`}
    </Text>
  );
}
