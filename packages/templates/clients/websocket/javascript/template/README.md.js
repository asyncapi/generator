import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getOperationMessageExamplePayloads, getServer } from '@asyncapi/generator-helpers';

export default function({ asyncapi, params }) {
  const server = getServer(asyncapi.servers(), params.server);
  const info = asyncapi.info();
  const clientName = getClientName(info);

  const operations = asyncapi.operations().all();
  
  return (
    <File name="README.md">
      <Text>
        {`# ${info.title()} 

## Overview

${info.description() || `A WebSocket client for ${info.title()}.`}

- **Version:** ${info.version()}
- **URL:** ${server.url()}


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
Closes the WebSocket connection.

### Available Operations

${operations.length > 0 ? 
      operations.map(operation => {
        const operationId = operation.id();
        const channels = operation.channels().all();
        
        const channelAddress = channels.length > 0 ? channels[0].address() : 'default';

        const examplePayloads = getOperationMessageExamplePayloads(operation);
        let messageExamples = '';
        if (examplePayloads.length > 0) {
          const firstExample = examplePayloads[0];
          messageExamples = `\n\n**Example:**\n\`\`\`javascript\nclient.${operationId}(${JSON.stringify(firstExample, null, 2)});\n\`\`\``;
        }
        return `#### \`${operationId}(payload)\`
${operation.summary() || `Sends a message to the '${channelAddress}' channel.`}
${operation.description() ? `\n${operation.description()}` : ''}${messageExamples}`;
      }).join('\n\n')
      : 
      `#### \`sendEchoMessage(payload)\`
Sends a message to the server that will be echoed back.
**Example:**
\`\`\`javascript
client.sendEchoMessage({ message: "Hello World" });
\`\`\`
`}

## Testing the client

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
