import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServer, getServerUrl, getInfo, getTitle } from '@asyncapi/generator-helpers';

export default function({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const title = getTitle(asyncapi);
  const serverUrl = getServerUrl(server);

  return (
    <File name="README.md">
      <Text newLines={2}>
{`# ${title}

## Overview

${info.description() || `A WebSocket client for ${title}.`}

- **Version:** ${info.version()}
- **Server URL:** ${serverUrl}

## Installation

Install dependencies:

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Usage

\`\`\`python
from ${params.clientFileName.replace('.py', '')} import ${clientName}

ws_client = ${clientName}()

async def main():
    await ws_client.connect()
    # use ws_client to send/receive messages
    await ws_client.close()
\`\`\`

## API

### \`connect()\`
Establishes a WebSocket connection.

### \`register_message_handler(handler_function)\`
Registers a callback for incoming messages.

### \`register_error_handler(handler_function)\`
Registers a callback for connection errors.

### \`close()\`
Closes the WebSocket connection.
`}
      </Text>
    </File>
  );
}
