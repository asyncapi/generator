import { Text } from '@asyncapi/generator-react-sdk';

export function UsageExampleSection({ language, clientName, clientFileName }) {
  if (language === 'python') {
    return (
      <Text newLines={2}>
{`## Usage

\`\`\`python
from ${clientFileName.replace('.py', '')} import ${clientName}

ws_client = ${clientName}()

async def main():
    await ws_client.connect()
    # use ws_client to send/receive messages
    await ws_client.close()
\`\`\`
`}
      </Text>
    );
  } else {
    return (
      <Text newLines={2}>
{`## Client API Reference

\`\`\`javascript
const ${clientName} = require('./${clientFileName.replace('.js', '')}');
const wsClient = new ${clientName}();
\`\`\`
`}
      </Text>
    );
  }
}