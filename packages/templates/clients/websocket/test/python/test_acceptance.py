import time
import sys
import os
import pytest
import asyncio
import websockets
import requests

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

@pytest.mark.asyncio
async def test_hoppscotch_client_sends_message():
    port = 8083
    expected_outgoing_message = "Sending acceptance test message to Microcks."

    # payload for trigger Microcks test
    payload = {
        "serviceId": "Hoppscotch WebSocket Server:1.0.0",
        "testEndpoint": "ws://websocket-acceptance-tester-py:8083/ws",
        "runnerType": "ASYNC_API_SCHEMA",
        "timeout": 30000,
        "filteredOperations": ["RECEIVE handleEchoMessage"]
    }
    # Create WebSocket server handler
    async def handler(websocket):
        ###############
        #
        # Most improtant part of test where we test clients send message
        #
        ###############
        await HoppscotchEchoWebSocketClient.send_message_static(expected_outgoing_message, websocket)

    # Start the WebSocket server
    server = await websockets.serve(handler, port=port)
    await asyncio.sleep(1)  # Give server time to start

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
        await asyncio.sleep(2)
    #await asyncio.sleep(1000)
    server.close()

    assert success, f"Microcks test {test_id} did not succeed"