import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServer, getServerUrl, getInfo, getTitle } from '@asyncapi/generator-helpers';
import { AvailableOperations } from '../components/AvailableOperations';

export default function({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);
  const title = getTitle(asyncapi);
  const serverUrl = getServerUrl(server);

  const operations = asyncapi.operations().all();
  
  return (
    <File name="README.md">
      <Text newLines={2}>
        {`# ${title} (Python Client)

## Overview

${info.description() || `A WebSocket client for ${title} written in Python.`}

- **Version:** ${info.version()}
- **URL:** ${serverUrl}

## Installation

Install dependencies:

\`\`\`bash
pip install -r requirements.txt
\`\`\`


## Client API Reference

\`\`\`python
from ${params.clientFileName.replace('.py', '')} import ${clientName}
ws_client = ${clientName}()
\`\`\`

Here, ws_client is an instance of the \`${clientName}\` class.
### Core Methods

#### \`connect()\`
Establishes a WebSocket connection to the server.

#### \`register_message_handler(handler_function)\`
Registers a callback to handle incoming messages.
- **Parameter:** \`handler_function\` - This function takes a parameter \`message\` (string).

#### \`register_error_handler(handler_function)\`
Registers a callback to handle WebSocket errors.
- **Parameter:** \`handler_function\` - This function takes a parameter \`error\` (Exception or object).

#### \`close()\`
Closes the WebSocket connection.`}
      </Text>
      <AvailableOperations operations={operations} />
      <Text newLines={2}>
        {`## Testing the client

\`\`\`python
from ${params.clientFileName.replace('.py', '')} import ${clientName}
ws_client = ${clientName}()

# Example of custom message handler

def my_handler(message):
    print('====================')
    print('Just proving I got the message in my_handler:', message)
    print('====================')

# Example of custom error handler

def my_error_handler(error):
    print('Errors from Websocket:', getattr(error, 'message', str(error)))

async def main():
    ws_client.register_message_handler(my_handler)
    ws_client.register_error_handler(my_error_handler)
    try:
        await ws_client.connect()
        # Loop to send messages every 5 seconds
        import asyncio
        interval = 5  # seconds
        message = 'Hello, Echo!'
        while True:
            try:
                await ws_client.send_echo_message(message)
            except Exception as error:
                print('Error while sending message:', error)
            await asyncio.sleep(interval)
    except Exception as error:
        print('Failed to connect to WebSocket:', getattr(error, 'message', str(error)))

import asyncio
asyncio.run(main())
\`\`\`

`}
      </Text>
    </File>
  );
}
