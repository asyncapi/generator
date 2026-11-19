import json
import os
import sys

import pytest

module_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../python/test/temp/snapshotTestResult/client_hoppscotch'))

# Add this directory to sys.path if it isn’t already there.
if module_path not in sys.path:
    sys.path.insert(0, module_path)

from client import HoppscotchEchoWebSocketClient


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

    assert len(client.ws_app.sent) == 1
    assert json.loads(client.ws_app.sent[0]) == {"payload": "test-first-second"}


def test_outgoing_processor_returning_none_keeps_the_message():
    client = create_client_with_recording_socket()
    client.register_outgoing_processor(lambda message: None)

    client.send_echo_message("test")

    assert client.ws_app.sent == ["test"]


def failing_processor(message):
    raise ValueError("processor failed")


def test_outgoing_processor_failure_goes_to_error_handlers_when_send_errors_are_suppressed():
    client = create_client_with_recording_socket(raise_send_errors=False)
    errors = []
    client.register_error_handler(errors.append)
    client.register_outgoing_processor(failing_processor)

    client.send_echo_message("test")

    assert [str(error) for error in errors] == ["processor failed"]
    assert client.ws_app.sent == []


def test_outgoing_processor_failure_is_raised_by_default():
    client = create_client_with_recording_socket()
    errors = []
    client.register_error_handler(errors.append)
    client.register_outgoing_processor(failing_processor)

    with pytest.raises(ValueError, match="processor failed"):
        client.send_echo_message("test")

    assert [str(error) for error in errors] == ["processor failed"]
    assert client.ws_app.sent == []
