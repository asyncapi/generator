import { Text } from '@asyncapi/generator-react-sdk';

export function Usage({ clientName, clientFileName, language }) {
  let snippet = '';

  if (language === 'python') {
    snippet = `
from ${clientFileName.replace('.py', '')} import ${clientName}

ws_client = ${clientName}()

async def main():
    await ws_client.connect()
    # use ws_client to send/receive messages
    await ws_client.close()
`;
  } else if (language === 'javascript') {
    snippet = `
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
`;
  }

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
