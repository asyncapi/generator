import time
import sys
import os
import pytest
import requests
import threading
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


class RecordingSocket:
    """Stands in for the WebSocketApp so tests can see what the client writes to the socket."""

    def __init__(self):
        self.sent = []

    def send(self, message):
        self.sent.append(message)


def create_client_with_recording_socket(**kwargs):
    client = HoppscotchEchoWebSocketClient(**kwargs)
    client.ws_app = RecordingSocket()
    return client


def test_outgoing_processors_run_in_registration_order_before_sending():
    client = create_client_with_recording_socket()
    client.register_outgoing_processor(lambda message: f"{message}-first")
    client.register_outgoing_processor(lambda message: {"payload": f"{message}-second"})

    client.send_echo_message("test")

    assert client.ws_app.sent == ['{"payload": "test-first-second"}']


def test_outgoing_processor_returning_none_keeps_the_message():
    client = create_client_with_recording_socket()
    client.register_outgoing_processor(lambda message: None)

    client.send_echo_message("test")

    assert client.ws_app.sent == ["test"]


def test_outgoing_processor_failure_is_routed_like_a_send_failure():
    def failing_processor(message):
        raise ValueError("processor failed")

    client = create_client_with_recording_socket(raise_send_errors=False)
    errors = []
    client.register_error_handler(errors.append)
    client.register_outgoing_processor(failing_processor)

    client.send_echo_message("test")

    assert [str(error) for error in errors] == ["processor failed"]
    assert client.ws_app.sent == []

    client.raise_send_errors = True
    with pytest.raises(ValueError, match="processor failed"):
        client.send_echo_message("test")
