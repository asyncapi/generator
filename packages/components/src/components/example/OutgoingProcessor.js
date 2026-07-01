import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript'} Language
 * Supported programming languages for the example outgoing processor.
 * Dart's WebSocket client does not expose an outgoing processor hook today,
 * so it is not part of the supported set.
 */

/**
 * Per-language source for the example outgoing processor function. The body
 * is intentionally static so the snapshot is stable across AsyncAPI inputs;
 * users replace it after generation.
 *
 * @type {Record<Language, string>}
 */
const outgoingProcessorConfig = {
  javascript: `function outgoingProcessor(message) {
  const processed = { payload: message, timestamp: new Date().toISOString() };
  console.log('Outgoing processor fired:', JSON.stringify(processed));
  return processed;
}`,
  python: `def outgoing_message_processor(message):
    """Process outgoing messages before they are sent (e.g., wrap with metadata)."""
    print(f"Outgoing processor fired: {message}")
    return {"payload": message, "timestamp": "2025-01-01T00:00:00Z"}`,
};

/**
 * Renders an example outgoing message processor function for the runnable
 * example script. The body is a starter implementation; users customize it
 * after generation.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Target programming language.
 * @returns {JSX.Element} A `Text` component containing the processor function definition.
 * @throws When the specified language is not supported.
 *
 * @example
 * import { OutgoingProcessor } from "@asyncapi/generator-components";
 *
 * function renderOutgoingProcessor() {
 *   return (
 *     <OutgoingProcessor language="python" />
 *   );
 * }
 *
 * renderOutgoingProcessor();
 */
export function OutgoingProcessor({ language }) {
  const supportedLanguages = Object.keys(outgoingProcessorConfig);
  const source = outgoingProcessorConfig[language];

  if (!source) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  return (
    <Text newLines={2}>
      {source}
    </Text>
  );
}
