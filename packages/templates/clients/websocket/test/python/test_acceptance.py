import time
import sys
import os
import pytest
import requests
import threading
from websockets.exceptions import ConnectionClosed, ConnectionClosedOK
from websockets.sync.server import serve

module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../python/test/temp/snapshotTestResult/client_hoppscotch'))

microcks_test_endpoint = 'http://microcks:8080/api/tests'

# Add this directory to sys.path if it isn’t already there.
if module_path not in sys.path:
    sys.path.insert(0, module_path)

from client import HoppscotchEchoWebSocketClient

def test_hoppscotch_client_receives_message():
    # Instantiate the client using the default URL.
    client = HoppscotchEchoWebSocketClient('ws://microcks-async-minion:8081/api/ws/Hoppscotch+Echo+WebSocket+Server/1.0.0/sendTimeStampMessage')

    received_messages = []
    expected_message = "GMT+0000 (Coordinated Universal Time)"

    def message_handler(message):
        received_messages.append(message)

    client.register_message_handler(message_handler)

    client.connect()

    # Wait up to 10 seconds for a message to be received.
    timeout = 10  # seconds
    start_time = time.time()
    while not received_messages and (time.time() - start_time < timeout):
        time.sleep(0.1)

    # Close the connection.
    client.close()

    assert expected_message in received_messages[0], (
        f"Expected message '{expected_message}' but got '{received_messages[0]}'"
    )

def test_hoppscotch_client_sends_message():
    port = 8083
    expected_outgoing_message = "Sending acceptance test message to Microcks."

    # payload for trigger Microcks test
    payload = {
        "serviceId": "Hoppscotch Echo WebSocket Server:1.0.0",
        "testEndpoint": "ws://websocket-acceptance-tester-py:8083/ws",
        "runnerType": "ASYNC_API_SCHEMA",
        "timeout": 30000,
        "filteredOperations": ["RECEIVE handleEchoMessage"]
    }
    
    server_ready = threading.Event()
    server_instance = None  # Will hold reference to server for shutdown
    
    # Create WebSocket server handler
    def handler(websocket):
        ###############
        #
        # Most important part of test where we test clients send message
        #
        ###############
        HoppscotchEchoWebSocketClient.send_echo_message_static(expected_outgoing_message, websocket)

    def run_server():
        nonlocal server_instance
        with serve(handler, "0.0.0.0", port) as server:
            server_instance = server
            server_ready.set()
            # serve_forever() blocks until shutdown() is called from another thread
            server.serve_forever()

    # Start the WebSocket server in background thread
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()
    server_ready.wait(timeout=5)
    time.sleep(1)  # Give server time to start

    try:
        # Start test in Microcks
        response = requests.post(microcks_test_endpoint, json=payload)
        response.raise_for_status()
        response_data = response.json()
        test_id = response_data.get('id')

        # Poll Microcks for result
        success = False
        for _ in range(30):
            result = requests.get(f"{microcks_test_endpoint}/{test_id}").json()
            print("Polling Microcks:", result)
            if result.get("success") is True:
                success = True
                break
            time.sleep(2)
        
        assert success, f"Microcks test {test_id} did not succeed"
    
    finally:
        # Cleanup: shutdown server and wait for thread
        if server_instance:
            server_instance.shutdown()  # This stops serve_forever()
        server_thread.join(timeout=5)

def test_hoppscotch_client_reconnects_after_close():
    opened = threading.Event()
    disconnected = threading.Event()

    class Client(HoppscotchEchoWebSocketClient):
        def on_open(self, ws):
            super().on_open(ws)
            opened.set()

    def handler(socket):
        try:
            socket.recv(timeout=5)
        except ConnectionClosedOK:
            disconnected.set()

    with serve(handler, "127.0.0.1", 0) as server:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        client = Client(f"ws://127.0.0.1:{server.socket.getsockname()[1]}")

        try:
            client.connect()
            assert opened.wait(timeout=5), "First connection did not open"
            client.close()
            assert disconnected.wait(timeout=5), "First connection did not close"

            opened.clear()
            client.connect()
            assert opened.wait(timeout=5), "Second connection did not open"
        finally:
            client.close()
            server.shutdown()
            thread.join(timeout=5)


def test_hoppscotch_client_cancels_pending_startup(monkeypatch):
    import websocket

    starting = threading.Event()
    resume = threading.Event()
    finished = threading.Event()
    accepted = threading.Event()
    original_run = websocket.WebSocketApp.run_forever

    def pause_startup(app, **kwargs):
        starting.set()
        try:
            assert resume.wait(timeout=5)
            return original_run(app, **kwargs)
        finally:
            finished.set()

    def handler(socket):
        accepted.set()
        socket.close()

    monkeypatch.setattr(websocket.WebSocketApp, "run_forever", pause_startup)
    with serve(handler, "127.0.0.1", 0) as server:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        client = HoppscotchEchoWebSocketClient(f"ws://127.0.0.1:{server.socket.getsockname()[1]}")

        try:
            client.connect()
            assert starting.wait(timeout=5)
            client.close()
            resume.set()
            assert finished.wait(timeout=5)
            assert not accepted.is_set()
        finally:
            resume.set()
            client.close()
            server.shutdown()
            thread.join(timeout=5)


def test_hoppscotch_client_close_keeps_app_and_stop_event_paired(monkeypatch):
    import websocket

    captured_old_app = threading.Event()
    resume_close = threading.Event()
    reconnect_attempted = threading.Event()
    closer = None
    reconnector = None

    class App:
        def __init__(self, *args, **kwargs):
            self.closed = threading.Event()

        def run_forever(self, **kwargs):
            self.closed.wait(timeout=5)

        def close(self):
            self.closed.set()

    class Client(HoppscotchEchoWebSocketClient):
        def __getattribute__(self, name):
            value = super().__getattribute__(name)
            if name == "ws_app" and threading.current_thread() is closer:
                captured_old_app.set()
                resume_close.wait()
            return value

    class ObservedLock:
        def __init__(self):
            self.lock = threading.Lock()

        def __enter__(self):
            if threading.current_thread() is reconnector:
                reconnect_attempted.set()
            self.lock.acquire()

        def __exit__(self, *args):
            self.lock.release()

    monkeypatch.setattr(websocket, "WebSocketApp", App)
    client = Client()
    client._connection_lock = ObservedLock()
    client.connect()
    old_app = client.ws_app
    client.close()

    def reconnect():
        client.connect()
        # Without synchronization the call can finish before close resumes.
        reconnect_attempted.set()

    closer = threading.Thread(target=client.close, daemon=True)
    reconnector = threading.Thread(target=reconnect, daemon=True)
    closer.start()
    try:
        assert captured_old_app.wait(timeout=5)
        reconnector.start()
        assert reconnect_attempted.wait(timeout=5)
    finally:
        resume_close.set()
        closer.join(timeout=5)
        if reconnector.ident is not None:
            reconnector.join(timeout=5)

    try:
        assert not closer.is_alive()
        assert not reconnector.is_alive()
        assert client.ws_app is not old_app
        assert not client.ws_app.closed.is_set()
        assert not client._stop_event.is_set()
    finally:
        client.close()


def test_hoppscotch_client_closes_socket_when_handshake_finishes_after_close(monkeypatch):
    import websocket

    handshaking = threading.Event()
    resume = threading.Event()
    connected = threading.Event()
    opened = threading.Event()
    sockets = []
    original_connect = websocket.WebSocket.connect
    workers = []

    class Client(HoppscotchEchoWebSocketClient):
        def on_open(self, ws):
            opened.set()

    def pause_handshake(ws, *args, **kwargs):
        sockets.append(ws)
        workers.append(threading.current_thread())
        handshaking.set()
        if not resume.wait(timeout=5):
            raise TimeoutError("Handshake was not released")
        original_connect(ws, *args, **kwargs)
        connected.set()

    def handler(socket):
        try:
            socket.recv(timeout=5)
        except ConnectionClosed:
            pass


    monkeypatch.setattr(websocket.WebSocket, "connect", pause_handshake)
    with serve(handler, "127.0.0.1", 0) as server:
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        client = Client(f"ws://127.0.0.1:{server.socket.getsockname()[1]}")

        try:
            client.connect()
            assert handshaking.wait(timeout=5)
            client.close()
            resume.set()
            workers[0].join(timeout=5)
            assert not workers[0].is_alive()
            assert connected.is_set()
            assert not opened.is_set()
            assert sockets[0].sock is None
        finally:
            resume.set()
            client.close()
            for worker in workers:
                worker.join(timeout=5)
            for socket in sockets:
                socket.shutdown()
            server.shutdown()
            thread.join(timeout=5)
