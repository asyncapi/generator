import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' | 'dart'} Language
 * Supported programming languages for the example imports block.
 */

const stripExtension = (fileName, ext) => fileName.replace(ext, '');

/**
 * Per-language renderer for the top-of-file imports block in the runnable
 * example script. Each entry receives `{ clientName, clientFileName }` and
 * returns the source for that language. Dart ignores `clientName`; Python
 * always imports `time` because the generated example's send loop and
 * long-running receive wait both call `time.sleep(...)`.
 *
 * @type {Record<Language, Function>}
 */
const importsConfig = {
  javascript: ({ clientName, clientFileName }) => {
    const moduleName = stripExtension(clientFileName, '.js');
    return `const ${clientName} = require('./${moduleName}');`;
  },
  python: ({ clientName, clientFileName }) => {
    const moduleName = stripExtension(clientFileName, '.py');
    return `import time
from ${moduleName} import ${clientName}`;
  },
  dart: ({ clientFileName }) => `import 'dart:async';
import '${clientFileName}';`,
};

/**
 * Renders the top-of-file imports block for the runnable example script.
 *
 * @param {Object} props - Component props.
 * @param {Language} props.language - Target programming language.
 * @param {string} props.clientFileName - The generated client file name (e.g. `myClient.js`, `my_client.py`, `my_client.dart`).
 * @param {string} [props.clientName] - The generated client class/symbol name. Required for JavaScript/Python; unused for Dart.
 * @returns {JSX.Element} A `Text` component containing the imports block.
 * @throws When the specified language is not supported.
 *
 * @example
 * import { Imports } from "@asyncapi/generator-components";
 *
 * function renderImports() {
 *   return (
 *     <Imports
 *       language="python"
 *       clientName="EchoClient"
 *       clientFileName="echo_client.py"
 *     />
 *   );
 * }
 *
 * renderImports();
 */
export function Imports({ language, clientName, clientFileName }) {
  const supportedLanguages = Object.keys(importsConfig);
  const buildSource = importsConfig[language];

  if (!buildSource) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  const source = buildSource({ clientName, clientFileName });

  return (
    <Text newLines={2}>
      {source}
    </Text>
  );
}
