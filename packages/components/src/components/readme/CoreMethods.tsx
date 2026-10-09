import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

type Language = 'python' | 'javascript';

interface CoreMethodConfig {
  msgHandler: string;
  errHandler: string;
}

const methodConfig: Record<Language, CoreMethodConfig> = {
  python: {
    msgHandler: 'register_message_handler(handler_function)',
    errHandler: 'register_error_handler(handler_function)',
  },
  javascript: {
    msgHandler: 'registerMessageHandler(handlerFunction)',
    errHandler: 'registerErrorHandler(handlerFunction)',
  },
};

interface CoreMethodsProps {
  /** Target language used to select method names. */
  language: string;
}

/**
 * Renders a list of core WebSocket client methods for a given target language.
 * @param props - Component props
 * @returns A Text component that contains a list of core client methods.
 * @throws When an unsupported language is provided.
 *
 * @example
 * import { CoreMethods } from "@asyncapi/generator-components";
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

export function CoreMethods({ language }: CoreMethodsProps): JSX.Element {
  const supportedLanguages = Object.keys(methodConfig);
  const config = methodConfig[language as Language];
  
  if (!config) {
    throw unsupportedLanguage(language, supportedLanguages);
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
