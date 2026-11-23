const { once } = require('events');
const { createRequire } = require('module');
const path = require('path');
const Generator = require('@asyncapi/generator');

function runJavaScriptConnectionTests(config, fixture) {
  describe('generated JavaScript client connection lifecycle', () => {
    let WebSocket;
    let WSClient;
    let server;
    let client;

    beforeAll(async () => {
      const outputPath = path.join(config.testResultPath, 'connection_lifecycle');
      const generator = new Generator(config.template, outputPath, {
        forceWrite: true,
        templateParams: { server: 'echoServer' }
      });
      await generator.generateFromFile(fixture);
      const clientPath = path.join(outputPath, config.clientFileName);
      WSClient = require(clientPath);
      WebSocket = createRequire(clientPath)('ws');
    }, 30000);

    beforeEach(async () => {
      server = new WebSocket.Server({ host: '127.0.0.1', port: 0 });
      await once(server, 'listening');
      client = new WSClient(`ws://127.0.0.1:${server.address().port}`);
    });

    afterEach(async () => {
      const socket = client?.websocket;
      if (socket && socket.readyState !== WebSocket.CLOSED) {
        const closed = new Promise(resolve => socket.once('close', resolve));
        socket.terminate();
        await closed;
      }
      if (!server) return;
      for (const peer of server.clients) peer.terminate();
      await new Promise(resolve => server.close(resolve));
    });

    it('shares a pending connection and reuses the open socket', async () => {
      const pending = client.connect();
      expect(client.connect()).toBe(pending);
      await pending;
      await client.connect();

      expect(server.clients.size).toBe(1);
      expect(client.websocket.listenerCount('close')).toBe(1);

      const [peer] = server.clients;
      const closed = once(peer, 'close');
      client.close();
      await closed;
      expect(server.clients.size).toBe(0);
    });

    it('reconnects without waiting for a peer that does not finish closing', async () => {
      await client.connect();
      const oldSocket = client.websocket;
      const [oldPeer] = server.clients;
      // Keep the old close frame unread while accepting a new connection.
      oldPeer.pause();
      client.close();

      expect(oldSocket.readyState).toBe(WebSocket.CLOSING);
      const reconnect = client.connect();
      const newSocket = client.websocket;
      expect(newSocket).not.toBe(oldSocket);
      expect(client.connect()).toBe(reconnect);
      await reconnect;

      expect(newSocket.readyState).toBe(WebSocket.OPEN);
      expect(oldSocket.readyState).toBe(WebSocket.CLOSING);

      const oldClosed = once(oldSocket, 'close');
      oldPeer.terminate();
      await oldClosed;
      expect(client.websocket).toBe(newSocket);
      await client.connect();
      expect(client.websocket).toBe(newSocket);
    });

    it('can reconnect after a completed close', async () => {
      await client.connect();
      const oldSocket = client.websocket;
      const closed = once(oldSocket, 'close');
      client.close();
      await closed;

      await client.connect();
      expect(client.websocket).not.toBe(oldSocket);
      expect(client.websocket.readyState).toBe(WebSocket.OPEN);
    });

    it('rejects pending callers when closed during the handshake and can reconnect', async () => {
      const first = client.connect();
      const second = client.connect();
      const closed = new Promise(resolve => client.websocket.once('close', resolve));

      client.close();
      const results = await Promise.allSettled([first, second]);
      expect(results.map(result => result.status)).toEqual(['rejected', 'rejected']);
      await closed;
      await client.connect();
      expect(server.clients.size).toBe(1);
    });
  });
}

module.exports = { runJavaScriptConnectionTests };
