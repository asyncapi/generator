import { Text } from '@asyncapi/generator-react-sdk';

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

export function Usage({ clientName, clientFileName, language }) {
  if (!language || typeof language !== 'string') {
    throw new Error(`Invalid "language" parameter: must be a non-empty string, received ${language}`);
  }

  const snippetFn = usageConfig[language];

  if (!snippetFn) {
    throw new Error(
      `Invalid "language" parameter: unsupported value "${language}"`
    );
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