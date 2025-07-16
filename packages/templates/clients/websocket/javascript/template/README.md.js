import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServer, getServerUrl } from '@asyncapi/generator-helpers';
import {getInfo, getTitle} from '/workspaces/generator/packages/helpers/src/utils'
import { AvailableOperations } from '../components/AvailableOperations';

export default function({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = getInfo(asyncapi);
  const clientName = getClientName(asyncapi, params.appendClientSuffix, params.customClientName);

  const operations = asyncapi.operations().all();
  
  return (
    <File name="README.md">
      <Text newLines={2}>
        {`# ${getTitle(asyncapi)} 

## Overview

${info.description() || `A WebSocket client for ${getTitle(asyncapi)}.`}

- **Version:** ${info.version()}
- **URL:** ${getServerUrl(server)}


## Client API Reference

\`\`\`javascript
const ${clientName} = require('./${params.clientFileName.replace('.js', '')}');
const wsClient = new ${clientName}();
\`\`\`

Here the wsClient is an instance of the \`${clientName}\` class.
### Core Methods

#### \`connect()\`
Establishes a WebSocket connection to the server.

#### \`registerMessageHandler(handlerFunction)\`
Registers a callback to handle incoming messages.
- **Parameter:** \`handlerFunction\` - This Function takes a parameter \`message\` which is a string. 

#### \`registerErrorHandler(handlerFunction)\`
Registers a callback to handle WebSocket errors.
- **Parameter:** \`handlerFunction\` - This Function takes a parameter \`error\` which is an object

#### \`close()\`
Closes the WebSocket connection.`}
      </Text>
      <AvailableOperations operations={operations} />
      <Text newLines={2}>
        {`## Testing the client

\`\`\`javascript
const ${clientName} = require('./${params.clientFileName.replace('.js', '')}');
const wsClient = new ${clientName}();


// Example of how custom message handler that operates on incoming messages can look like

function myHandler(message) {
  console.log('====================');
  console.log('Just proving I got the message in myHandler:', message);
  console.log('====================');  
}

// Example of custom error handler

function myErrorHandler(error) {
  console.error('Errors from Websocket:', error.message);
}

async function main() {
  wsClient.registerMessageHandler(myHandler);
  wsClient.registerErrorHandler(myErrorHandler);

  try {
    await wsClient.connect();

    // Loop to send messages every 5 seconds
    const interval = 5000; // 5 seconds
    const message = 'Hello, Echo!';

    while (true) {
      try {
        await wsClient.sendEchoMessage(message);
      } catch (error) {
        console.error('Error while sending message:', error);
      }
      // Wait for the interval before sending the next message
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  } catch (error) {
    console.error('Failed to connect to WebSocket:', error.message);
  }
}

main();
\`\`\`

`}
      </Text>
    </File>
  );
}