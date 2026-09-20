import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for the outgoing processor registration method.
 */

/**
 * Per-language source for the client method that registers an outgoing message
 * processor. Each entry is the whole method verbatim so the generated client
 * output stays identical to the previous template-local components.
 *
 * @type {Record<Language, string>}
 */
const registerOutgoingProcessorConfig = {
  python: `def register_outgoing_processor(self, processor):
    """
    Register a callable that processes outgoing messages automatically.
    These processors run in sequence before each message is sent.
    """
    if callable(processor):
        self.outgoing_processors.append(processor)
    else:
        print("Outgoing processor must be callable")`,
  javascript: `registerOutgoingProcessor(processor) {
  if (typeof processor === 'function') {
    this.outgoingProcessors.push(processor);
  } else {
    console.warn('Outgoing processor must be a function');
  }
}`,
  dart: `/// Register a function that processes outgoing messages automatically.
/// These processors run in sequence before each message is sent.
void registerOutgoingProcessor(dynamic Function(dynamic) processor) {
  _outgoingProcessors.add(processor);
}`,
};

/**
 * Renders the client method that registers an outgoing message processor.
 * Registered processors are stored on the client instance and run in sequence
 * on each message before it is sent.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Target programming language.
 * @returns {JSX.Element} A `Text` component containing the registration method definition.
 * @throws When the specified language is not supported.
 *
 * @example
 * import { RegisterOutgoingProcessor } from "@asyncapi/generator-components";
 *
 * function renderRegisterOutgoingProcessor() {
 *   return (
 *     <RegisterOutgoingProcessor language="python" />
 *   );
 * }
 *
 * renderRegisterOutgoingProcessor();
 */
export function RegisterOutgoingProcessor({ language }) {
  const supportedLanguages = Object.keys(registerOutgoingProcessorConfig);
  // Inherited keys such as "constructor" would otherwise resolve to a truthy non-string
  // value and skip the unsupported-language error path.
  const source = Object.hasOwn(registerOutgoingProcessorConfig, language)
    ? registerOutgoingProcessorConfig[language]
    : undefined;

  if (!source) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  return (
    <Text newLines={2} indent={2}>
      {source}
    </Text>
  );
}
