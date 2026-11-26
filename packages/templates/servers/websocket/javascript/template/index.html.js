import { File } from '@asyncapi/generator-react-sdk';
import { getServer, getServerUrl, getTitle } from '@asyncapi/generator-helpers';

/**
 * Generates `index.html`, a page whose browser console talks to the generated WebSocket server.
 *
 * @param {object} context - Template render context.
 * @param {object} context.asyncapi - The parsed AsyncAPI document.
 * @param {object} context.params - Template generation parameters (`server` names the server the page connects to).
 * @returns {JSX.Element} A `File` component containing the page.
 * @throws {Error} If the document has no title, or no server named `params.server`.
 */
export default function ({ asyncapi, params }) {
  const title = getTitle(asyncapi);
  const serverUrl = getServerUrl(getServer(asyncapi.servers(), params.server));
  // Why: an AsyncAPI 3 channel `address` is optional and may be `null` (Channel Object, `address`). Such a channel
  // gets no route in the generated server, so the page leaves it out as well.
  const channels = asyncapi.channels().all().filter((channel) => channel.address() !== null && channel.address() !== undefined);
  // Why: the source listed the channels that have a 2.x `subscribe` operation. In AsyncAPI 2.x `subscribe` means
  // the application sends, so these are the channels with a send operation (api-map A4).
  const channelLines = channels
    .filter((channel) => channel.operations().filterBySend().length > 0)
    .map((channel) => `\n      console.log('* ${channel.address()}');`)
    .join('');
  const exampleAddress = channels.length > 0 ? channels[0].address() : '';

  return (
    <File name="index.html">
      {`<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${title}</title>
    <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
    <meta content="utf-8" http-equiv="encoding">
  </head>

  <body>
    <h1>Open your browser console to see the logs and details of API you can use to talk to the server.</h1>
    <script>
    let connection;

    function displayHelp() {
      console.log('Available channels:')${channelLines}
      console.log('Available commands:')
      console.log('- listen: Establish a connection with the server at a given path.')
      console.log('  Usage: listen(channelName)');
      console.log(\`  Example: listen('${exampleAddress}')\`);
      console.log('- send: Send a message to the server at a currently connected path.')
      console.log('  Usage: send(message)');
      console.log(\`  Example: send({ greet: 'Hello from client' })\`);
    }

    function listen(path) {
      const url = new URL(path, '${serverUrl}').toString()
      connection = new WebSocket(url)

      connection.onerror = error => {
        console.log(\`WebSocket error: \${error}\`)
      }

      connection.onopen = () => {
        console.log('Connected to server');
      }

      connection.onmessage = e => {
        console.log('Server says:', e.data)
      }
    }

    function send(message) {
      if (!connection) {
        console.error('You have to call listen(channelName) first. See the list of available commands and below.');
        displayHelp();
        return;
      }
      let msg = message;
      if (typeof msg === 'object') msg = JSON.stringify(msg);
      connection.send(msg);
      console.info('Hint: check out the server logs to see your message.');
    }

    displayHelp();
    </script>
  </body>
</html>
`}
    </File>
  );
}
