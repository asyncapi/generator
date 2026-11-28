import { File, Text } from '@asyncapi/generator-react-sdk';
import { ExampleExchange } from '../components/ExampleExchange';

/**
 * Generates `example.js`, a client script that talks to the running generated server:
 * it connects to every channel, sends one message for every operation the server receives and prints the answers.
 *
 * @param {object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @returns {JSX.Element} A `File` component containing the example.
 */
export default function ({ asyncapi }) {
  // Why: an AsyncAPI 3 channel may have no address (`address: null`, or no `address` field). Such a channel
  // has no route in the generated server, so the example doesn't connect to it.
  const channels = asyncapi.channels().all().filter((channel) => {
    const address = channel.address();
    return address !== null && address !== undefined;
  });

  const exchanges = channels.map((channel) => (
    <ExampleExchange address={channel.address()} receiveOperations={channel.operations().filterByReceive()} />
  ));

  return (
    <File name="example.js">
      <Text>
        {`const WebSocket = require('ws');
const config = require('./src/lib/config');

// How long the example waits for the answers of the server before it closes a connection.
const WAIT_FOR_ANSWERS_MS = 1000;

/**
 * Connects to the server at a path, prints every message the server sends, sends the given messages and closes the connection.
 *
 * @param {string} path The path of the channel to connect to.
 * @param {string[]} messages The messages to send once connected.
 * @returns {Promise<void>} Resolves when the connection is closed. Rejects when it fails.
 */
function exchangeMessages(path, messages) {
  return new Promise((resolve, reject) => {
    const connection = new WebSocket(\`ws://localhost:\${config.port}\${path}\`);

    connection.on('error', reject);
    connection.on('close', resolve);
    connection.on('message', (data) => {
      console.log(\`\${path} server says:\`, data.toString());
    });
    connection.on('open', () => {
      console.log(\`\${path} connected.\`);
      for (const message of messages) {
        console.log(\`\${path} sending:\`, message);
        connection.send(message);
      }
      setTimeout(() => connection.close(), WAIT_FOR_ANSWERS_MS);
    });
  });
}

async function main() {`}
      </Text>
      {exchanges}
      <Text>
        {`}

main().catch((error) => {
  // A refused connection has an error code and no message.
  console.error('The example failed. Is the server running?', error.message || error.code);
  process.exitCode = 1;
});`}
      </Text>
    </File>
  );
}
