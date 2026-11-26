import { File } from '@asyncapi/generator-react-sdk';

/**
 * Generates src/api/index.js, the entry point of the WebSocket server project. It starts the HTTP server
 * and passes each WebSocket connection to the handler that src/api/routes.js maps to the request path.
 *
 * @returns {JSX.Element} A `File` component containing the generated entry point.
 */
export default function () {
  return (
    <File name="index.js">
      {`const http = require('node:http');
const { WebSocketServer } = require('ws');
const config = require('../lib/config');
const routes = require('./routes');

const start = () => {
  const server = http.createServer((req, res) => {
    res.writeHead(404);
    res.end('Error: path not found');
  });
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    // URL.parse returns null for a request target that is not a valid URL. Such a request matches no route.
    const url = URL.parse(req.url, 'http://localhost');
    const handler = url && routes.get(url.pathname);

    if (!handler) {
      socket.write('HTTP/1.1 404 Not Found\\r\\n\\r\\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, async (ws) => {
      try {
        await handler(ws, { path: url.pathname, query: Object.fromEntries(url.searchParams) });
      } catch (err) {
        console.error(err);
      }
    });
  });

  server.listen(config.port);
  console.info(\`Listening on port \${config.port}\`);
};

start();
`}
    </File>
  );
}
