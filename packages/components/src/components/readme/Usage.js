import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage, invalidClientName, invalidClientFileName } from '../../../utils/ErrorHandling';

/**
 * @typedef {'python' | 'javascript' } Language
 * Supported programming languages.
 */
const usageConfig = {
  python: (clientName, clientFileName) => `
from ${clientFileName.replace('.py', '')} import ${clientName}

ws_client = ${clientName}()

async def main():
    await ws_client.connect()
    # use ws_client to send/receive messages
    await ws_client.close()
`,

  javascript: (clientName, clientFileName) => `
const ${clientName} = require('./${clientFileName.replace('.js', '')}');
const wsClient = new ${clientName}();

async function main() {
  try {
    await wsClient.connect();
    // use wsClient to send/receive messages
    await wsClient.close();
  } catch (error) {
    console.error('Failed to connect:', error);
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
 * 
 * @example
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
    unsupportedLanguage(language, supportedLanguages);
  }

  if (typeof clientName !== 'string' || clientName.trim() === '') {
    invalidClientName(clientName);
  }

  if (typeof clientFileName !== 'string' || clientFileName.trim() === '') {
    invalidClientFileName(clientFileName);
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