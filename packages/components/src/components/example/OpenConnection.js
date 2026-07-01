import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for the example connect invocation.
 */

// Why: JavaScript and Dart use the same `await ${instance}.connect();` shape
// and the same indent/newLines today, so they share an awaited-call builder.
// Sonar's `no-identical-functions` rule trips on near-twin arrow expressions
// without this dedupe.
const awaitedConnect = (instanceName) => ({
  text: `await ${instanceName}.connect();`,
  indent: 4,
  newLines: 2,
});

/**
 * Per-language configuration for rendering the `client.connect()` invocation
 * line inside the generated runnable example script. Each entry takes the
 * client instance name and returns `{ text, indent, newLines }`.
 *
 * @type {Record<Language, Function>}
 */
const openConnectionConfig = {
  javascript: awaitedConnect,
  python: (instanceName) => ({
    text: `${instanceName}.connect()`,
    indent: 8,
    newLines: 1,
  }),
  dart: awaitedConnect,
};

/**
 * Renders the `client.connect()` invocation line for the runnable example
 * script in the chosen language. Sibling of {@link Close} and
 * {@link SendInvocations}; meant to be embedded inside {@link Main}.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Target programming language.
 * @param {string} props.instanceName - The client instance variable name (e.g. `echoClient`, `echo_client`).
 * @returns {JSX.Element} A `Text` component containing the connect invocation line.
 * @throws When the specified language is not supported.
 *
 * @example
 * import { OpenConnection } from "@asyncapi/generator-components";
 *
 * function renderOpenConnection() {
 *   return (
 *     <OpenConnection language="javascript" instanceName="echoClient" />
 *   );
 * }
 *
 * renderOpenConnection();
 */
export function OpenConnection({ language, instanceName }) {
  const supportedLanguages = Object.keys(openConnectionConfig);
  const buildLine = openConnectionConfig[language];

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
