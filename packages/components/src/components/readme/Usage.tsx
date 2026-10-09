import { Text } from '@asyncapi/generator-react-sdk';
import { unsupportedLanguage, invalidClientName, invalidClientFileName } from '../../utils/ErrorHandling';

type Language = 'python' | 'javascript';

type UsageSnippetFn = (clientName: string, clientFileName: string) => string;

const usageConfig: Record<Language, UsageSnippetFn> = {
  python: (clientName: string, clientFileName: string): string => `
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

  javascript: (clientName: string, clientFileName: string): string => `
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

interface UsageProps {
  /** The exported name of the client. */
  clientName: string;
  /** The file name where the client is defined. */
  clientFileName: string;
  /** The target language for which to render the usage snippet. */
  language: string;
}

/**
 * Renders a usage example snippet for a generated WebSocket client in a given language.
 *
 * @param props - Component props
 * @returns A Text component containing a formatted usage example snippet.
 * @throws When the specified language is not supported.
 * @throws When clientName is missing or invalid.
 * @throws When clientFileName is missing or invalid.
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
export function Usage({ clientName, clientFileName, language }: UsageProps): JSX.Element {
  const supportedLanguages = Object.keys(usageConfig);
  const snippetFn = usageConfig[language as Language];

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