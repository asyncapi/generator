import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage, invalidClientName, invalidClientFileName } from '../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' } Language
 * Supported programming languages.
 */
const usageConfig = {
  python: (clientName, clientFileName) => `
from ${clientFileName.replace('.py', '')} import ${clientName}

# raise_send_errors defaults to True: a failed send raises after the registered
# error handlers run, so you can react to each failure. Pass
# raise_send_errors=False to keep a high-throughput producer loop running and
# rely on registered error handlers instead.
ws_client = ${clientName}()

async def main():
    await ws_client.connect()
    try:
        # use ws_client to send/receive messages
        pass
    except Exception as error:
        # only reached when raise_send_errors is True (the default)
        print("Send failed:", error)
    await ws_client.close()
`,

  javascript: (clientName, clientFileName) => `
const ${clientName} = require('./${clientFileName.replace('.js', '')}');

// throwSendErrors defaults to true: a failed send re-throws after the registered
// error handlers run, so you can react to each failure. Pass
// new ${clientName}(undefined, false) to keep a high-throughput producer loop
// running and rely on registered error handlers instead.
const wsClient = new ${clientName}();

async function main() {
  try {
    await wsClient.connect();
    // use wsClient to send/receive messages
    await wsClient.close();
  } catch (error) {
    console.error('Failed to connect or send:', error);
  }
}

main();
`,
};

/**
 * Renders a usage example snippet for a generated WebSocket client in a given language.
 * 
 * @param {Object} props - Component props
 * @param {string} props.clientName - The exported name of the client.
 * @param {string} props.clientFileName - The file name where the client is defined.
 * @param {Language} props.language - The target language for which to render the usage snippet
 * @returns {JSX.Element} A Text component containing a formatted usage example snippet.
 * @throws {Error} When the specified language is not supported.
 * @throws {Error} When clientName is missing or invalid.
 * @throws {Error} When clientFileName is missing or invalid.
 * 
 * @example
 * import { Usage } from "@asyncapi/generator-components";
 * const clientName = "MyClient";
 * const clientFileName = "myClient.js";
 * const language = "javascript";
 * 
 * function renderUsage(){
 *   return (
 *     <Usage 
 *        clientName={clientName} 
 *        clientFileName={clientFileName} 
 *        language={language}
 *     />
 *   )
 * }
 * 
 * renderUsage();
 */
export function Usage({ clientName, clientFileName, language }) {
  const supportedLanguages = Object.keys(usageConfig);
  const snippetFn = usageConfig[language];

  if (!snippetFn) {
    throw unsupportedLanguage(language, supportedLanguages);
  }

  if (typeof clientName !== 'string' || clientName.trim() === '') {
    throw invalidClientName(clientName);
  }

  if (typeof clientFileName !== 'string' || clientFileName.trim() === '') {
    throw invalidClientFileName(clientFileName);
  }

  const snippet = snippetFn(clientName, clientFileName);

  return (
    <Text newLines={2}>
      {`## Usage

\`\`\`${language}
${snippet.trim()}
\`\`\`
`}
    </Text>
  );
}