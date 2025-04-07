import time
import sys
import os

module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../python/test/temp/snapshotTestResult'))

# Add this directory to sys.path if it isn’t already there.
if module_path not in sys.path:
    sys.path.insert(0, module_path)

from client_hoppscotch import HoppscotchEchoWebSocketClient

def test_hoppscotch_client_receives_message():
    # Instantiate the client using the default URL.
    client = HoppscotchEchoWebSocketClient('ws://localhost:8081/api/ws/Hoppscotch+WebSocket+Server/1.0.0/sendTimeStampMessage')

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