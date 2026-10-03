import { File } from '@asyncapi/generator-react-sdk';
import { getTitle, getInfo } from '@asyncapi/generator-helpers';

/**
 * Generates README.md documentation for the created WebSocket server.
 *
 * @param {Object} args Template arguments.
 * @param {Object} args.asyncapi Parsed AsyncAPI document.
 * @param {Object} args.params Template parameters.
 * @returns {import('@asyncapi/generator-react-sdk').File} Generated README.md file.
 */
export default function ({ asyncapi, params = {} }) {
  const title = getTitle(asyncapi);
  const info = getInfo(asyncapi);
  const port = params.port || '8080';
  const description = info.description() ? `${info.description()}\n\n` : '';

  const channelsList = asyncapi.channels().all().map(ch => {
    const address = ch.address();
    const operations = ch.operations && !ch.operations().isEmpty() ? ch.operations().all() : [];
    const opsDoc = operations.map(op => {
      const summary = op.summary() ? ` - ${op.summary()}` : '';
      return `- **Operation ID**: \`${op.id()}\` (Action: \`${op.action()}\`)${summary}`;
    }).join('\n');

    return `### Channel: \`${address}\`\n\n${opsDoc || 'No operations explicitly attached to this channel.'}`;
  }).join('\n\n');

  const content = `# ${title} - WebSocket Server

${description}This Node.js WebSocket server was generated using the AsyncAPI Generator baked-in template.

## Getting Started

### 1. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start the server
\`\`\`bash
npm start
\`\`\`
By default, the server will start on port \`${port}\`.

## Channels & Routes

${channelsList}

## Features

- **Dynamic Route Dispatching**: Routes WebSocket connections based on channel addresses defined in the AsyncAPI document.
- **Runtime Message Validation**: Validates inbound and outbound message payloads using \`@asyncapi/keeper\`.
- **Broadcast & Direct Messaging**: Built-in methods to send validated messages to specific clients or broadcast across channels.
`;

  return (
    <File name="README.md">
      {content}
    </File>
  );
}
