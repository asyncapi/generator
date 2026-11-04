import { render } from '@asyncapi/generator-react-sdk';
import { Connect, CloseConnection } from '../../src/index';
import vm from 'vm';
import { EventEmitter, once } from 'events';
import WebSocket, { WebSocketServer } from 'ws';

describe('Testing of Connect function', () => {
  const languages = ['javascript', 'python', 'dart'];
  it.each(languages)('render %s Connect method', (language) => {
    const result = render(
      <Connect 
        language={language} 
        title='HoppscotchEchoWebSocketClient'
      />
    );
    const actual = result.trim();
    expect(actual).toMatchSnapshot();
  });

  test('throws an error when unsupported language is provided', () => {
    expect(() => render(
      <Connect 
        language='java'
        title='HoppscotchEchoWebSocketClient'
      />
    )).toThrow(/Unsupported language "java". Supported languages:/);
  });

  test('throws an error when language is not provided', () => {
    expect(() => render(
      <Connect 
        title='HoppscotchEchoWebSocketClient'
      />
    )).toThrow(/Language is required. Supported languages:/);
  });
});

describe('Generated JavaScript connection lifecycle', () => {
  let Client;
  let sockets;

  const createClientClass = (SocketImplementation) => {
    const connect = render(<Connect language="javascript" title="Test" />);
    const close = render(<CloseConnection language="javascript" />);
    return vm.runInNewContext(`(class Client {
      constructor(url) {
        this.url = url;
        this.websocket = null;
        this.messageHandlers = [];
        this.errorHandlers = [];
      }
      ${connect}
      ${close}
    })`, { WebSocket: SocketImplementation, console: { log() {}, error() {} } });
  };

  beforeEach(() => {
    sockets = [];
    class Socket extends EventEmitter {
      constructor() {
        super();
        this.readyState = WebSocket.CONNECTING;
        sockets.push(this);
      }
      open() {
        this.readyState = WebSocket.OPEN;
        this.onopen();
      }
      close() {
        this.readyState = WebSocket.CLOSING;
      }
      finishClose() {
        this.readyState = WebSocket.CLOSED;
        this.emit('close');
        this.onclose();
      }
    }
    Object.assign(Socket, {
      CONNECTING: WebSocket.CONNECTING,
      OPEN: WebSocket.OPEN,
      CLOSING: WebSocket.CLOSING,
      CLOSED: WebSocket.CLOSED
    });
    Client = createClientClass(Socket);
  });

  it('should reuse an open connection', async () => {
    const client = new Client();
    const pending = client.connect();
    sockets[0].open();
    await pending;
    await client.connect();
    expect(sockets).toHaveLength(1);
    expect(client.websocket).toBe(sockets[0]);
  });

  it('should share the pending promise between concurrent callers', async () => {
    const client = new Client();
    const first = client.connect();
    const second = client.connect();
    expect(second).toBe(first);
    expect(sockets).toHaveLength(1);
    sockets[0].open();
    await Promise.all([first, second]);
  });

  it('should reject reconnects while the socket is closing', async () => {
    const client = new Client();
    const pending = client.connect();
    sockets[0].open();
    await pending;
    client.close();
    await expect(client.connect()).rejects.toThrow('connection is closing');
    expect(sockets).toHaveLength(1);
  });

  it('should create a new connection after the previous socket closes', async () => {
    const client = new Client();
    const first = client.connect();
    sockets[0].open();
    await first;
    client.close();
    sockets[0].finishClose();
    const second = client.connect();
    sockets[1].open();
    await second;
    expect(sockets).toHaveLength(2);
    expect(client.websocket).toBe(sockets[1]);
  });

  it('should reject all waiting callers when opening fails and allow retry after closure', async () => {
    const client = new Client();
    const first = client.connect();
    const second = client.connect();
    const failure = new Error('connection failed');
    const results = Promise.allSettled([first, second]);
    sockets[0].onerror(failure);
    sockets[0].finishClose();
    expect(await results).toEqual([
      { status: 'rejected', reason: failure },
      { status: 'rejected', reason: failure }
    ]);
    const retry = client.connect();
    sockets[1].open();
    await retry;
  });

  it('should reject a connection that closes before opening', async () => {
    const client = new Client();
    const pending = client.connect();
    const rejection = expect(pending).rejects.toThrow('closed before it opened');
    client.close();
    sockets[0].finishClose();
    await rejection;
  });

  it('should close the only connection after repeated calls against a real server', async () => {
    const server = new WebSocketServer({ host: '127.0.0.1', port: 0 });
    let client;
    try {
      await once(server, 'listening');
      const RealClient = createClientClass(WebSocket);
      client = new RealClient(`ws://127.0.0.1:${server.address().port}`);
      await Promise.all([client.connect(), client.connect()]);
      await client.connect();
      expect(server.clients.size).toBe(1);
      const [serverSocket] = server.clients;
      const closed = once(serverSocket, 'close');
      client.close();
      await closed;
      expect(server.clients.size).toBe(0);
    } finally {
      if (client?.websocket) client.websocket.terminate();
      for (const socket of server.clients) socket.terminate();
      await new Promise(resolve => server.close(resolve));
    }
  });
});
