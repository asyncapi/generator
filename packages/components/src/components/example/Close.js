import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for the example close invocation.
 */

/**
 * Per-language configuration for rendering the `client.close()` invocation
 * line inside the generated runnable example script. Each entry takes the
 * client instance name and returns `{ text, indent, newLines }`.
 *
 * @type {Record<Language, Function>}
 */
const closeConfig = {
  javascript: (instanceName) => ({
    text: `await ${instanceName}.close();`,
    indent: 4,
    newLines: 1,
  }),
  python: (instanceName) => ({
    text: `${instanceName}.close()`,
    indent: 8,
    newLines: 1,
  }),
  dart: (instanceName) => ({
    text: `${instanceName}.close();`,
    indent: 4,
    newLines: 1,
  }),
};

/**
 * Renders the `client.close()` invocation line for the runnable example
 * script in the chosen language. Sibling of {@link OpenConnection}; meant to
 * be embedded inside the `finally` block of {@link Main}.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Target programming language.
 * @param {string} props.instanceName - The client instance variable name (e.g. `echoClient`, `echo_client`).
 * @returns {JSX.Element} A `Text` component containing the close invocation line.
 * @throws When the specified language is not supported.
 *
 * @example
 * import { Close } from "@asyncapi/generator-components";
 *
 * function renderClose() {
 *   return (
 *     <Close language="javascript" instanceName="echoClient" />
 *   );
 * }
 *
 * renderClose();
 */
export function Close({ language, instanceName }) {
  const supportedLanguages = Object.keys(closeConfig);
  const buildLine = closeConfig[language];

  if (!buildLine) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  const { text, indent, newLines } = buildLine(instanceName);

  return (
    <Text indent={indent} newLines={newLines}>
      {text}
    </Text>
  );
}
