/**
 * @jest-environment node
 */

const { once } = require('events');
const WebSocket = require('ws');
const WSClient = require('../../javascript/test/temp/snapshotTestResult/client_hoppscotch/client.js');

describe('generated JavaScript client connection lifecycle', () => {
  let server;
  let client;

  beforeEach(async () => {
    server = new WebSocket.Server({ host: '127.0.0.1', port: 0 });
    await once(server, 'listening');
    client = new WSClient(`ws://127.0.0.1:${server.address().port}`);
  });

  afterEach(async () => {
    const socket = client.websocket;
    if (socket && socket.readyState !== WebSocket.CLOSED) {
      const closed = new Promise(resolve => socket.once('close', resolve));
      socket.terminate();
      await closed;
    }
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

  it('shares a reconnect that waits for the previous socket to close', async () => {
    await client.connect();
    const oldSocket = client.websocket;
    client.close();

    const reconnect = client.connect();
    expect(client.connect()).toBe(reconnect);
    expect(client.websocket).toBe(oldSocket);
    await reconnect;

    expect(oldSocket.readyState).toBe(WebSocket.CLOSED);
    expect(client.websocket).not.toBe(oldSocket);
    expect(server.clients.size).toBe(1);
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
