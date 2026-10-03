import { Text } from '@asyncapi/generator-react-sdk';

/**
 * Renders server start and stop lifecycle methods.
 *
 * @returns {JSX.Element} Lifecycle code component.
 */
export function ServerLifecycle() {
  return (
    <Text indent={2} newLines={2}>
      {`/**
   * Starts the HTTP and WebSocket server.
   *
   * @param {number|string} [port] Port to listen on. Defaults to this.port.
   * @param {string} [host] Host to bind. Defaults to this.host.
   * @returns {Promise<http.Server>} Resolves with the running http.Server instance.
   */
  async start(port = this.port, host = this.host) {
    await this.compileOperationSchemas();

    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('AsyncAPI WebSocket Server Running\\n');
      });

      this.wss = new WebSocket.Server({ noServer: true });

      this.server.on('upgrade', (req, socket, head) => {
        const { pathname } = new URL(req.url, \`http://\${req.headers.host || 'localhost'}\`);
        const matchedChannel = this.matchChannel(pathname);
        if (!matchedChannel) {
          socket.write('HTTP/1.1 404 Not Found\\r\\n\\r\\n');
          socket.destroy();
          return;
        }

        this.wss.handleUpgrade(req, socket, head, (ws) => {
          this.handleConnection(ws, req, matchedChannel);
        });
      });

      this.server.listen(port, host, () => {
        console.log(\`[WebSocketServer] Server listening on ws://\${host}:\${port}\`);
        resolve(this.server);
      });

      this.server.on('error', reject);
    });
  }

  /**
   * Stops the server and closes all active WebSocket connections.
   *
   * @returns {Promise<void>} Resolves when the server is fully closed.
   */
  async stop() {
    return new Promise((resolve) => {
      for (const channel of Object.values(this.channels)) {
        for (const client of channel.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.close(1000, 'Server stopping');
          }
        }
        channel.clients.clear();
      }

      const closePromises = [];

      if (this.wss) {
        closePromises.push(new Promise((wssResolve) => this.wss.close(wssResolve)));
      }

      if (this.server) {
        closePromises.push(new Promise((serverResolve) => this.server.close(serverResolve)));
      }

      Promise.all(closePromises).then(() => resolve());
    });
  }`}
    </Text>
  );
}
