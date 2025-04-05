import { File, Text } from '@asyncapi/generator-react-sdk';
import { getClientName, getServer } from '@asyncapi/generator-helpers';

function renderOperations(operations) {
  if (operations.length === 0) {
    return `#### \`sendEchoMessage(payload)\`
Sends a message to the server that will be echoed back.

**Example:**
\`\`\`javascript
client.sendEchoMessage({ message: "Hello World" });
\`\`\`
`;
  }

  return operations.map(operation => {
    const operationId = operation.id();
    const channel = operation.channels().all()[0];
    const channelAddress = channel ? channel.address() : 'default';
    const example = getFirstExample(channel);

    return `#### \`${operationId}(payload)\`
${operation.summary() || `Sends a message to the '${channelAddress}' channel.`}
${operation.description() ? `\n${operation.description()}` : ''}${example}`;
  }).join('\n\n');
}

function getFirstExample(channel) {
  if (!channel) return '';
  const messages = channel.messages().all();
  if (!messages.length) return '';

  const firstExample = messages[0].examples()?.[0];
  if (!firstExample) return '';

  return `

**Example:**
\`\`\`javascript
client.${channel.address()}(${JSON.stringify(firstExample.payload(), null, 2)});
\`\`\`
`;
}

function renderTestingSection(clientName, params) {
  return `
## Testing the client

\`\`\`javascript
const ${clientName} = require('./${params.clientFileName.replace('.js', '')}');
const wsClient = new ${clientName}();

// Example of message handler
function myHandler(message) {
  console.log('Received message:', message);
}

// Example of error handler
function myErrorHandler(error) {
  console.error('WebSocket error:', error.message);
}

async function main() {
  wsClient.registerMessageHandler(myHandler);
  wsClient.registerErrorHandler(myErrorHandler);

  try {
    await wsClient.connect();

    const interval = 5000;
    const message = 'Hello, Echo!';

    while (true) {
      try {
        await wsClient.sendEchoMessage(message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

main();
\`\`\`
`;
}

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

#### \`registerErrorHandler(handlerFunction)\`
Registers a callback to handle WebSocket errors.

#### \`close()\`
Closes the WebSocket connection.

### Available Operations

${renderOperations(operations)}

${renderTestingSection(clientName, params)}
`}
      </Text>
    </File>
  );
}
