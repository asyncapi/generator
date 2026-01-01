import sys
import os
import time

sys.path.append(os.path.join(os.path.dirname(__file__), 'test'))

from temp.snapshotTestResult.client_slack.client import SlackWebsocketAPIClient


def handle_hello_message(message):
    print(f"[WebSocket][HELLO] Received hello message: {message}")


def handle_event_message(message):
    print(f"[WebSocket][EVENT] Received event message: {message}")


def handle_disconnect_message(message):
    print(f"[WebSocket][DISCONNECT] Received disconnect message: {message}")


def handle_unrecognized_message(raw_message):
    print(f"[WebSocket][UNRECOGNIZED] Received unrecognized message: {raw_message}")


def main():
    client = SlackWebsocketAPIClient()

    client.register_on_hello_message_handler(
        handle_hello_message,
        discriminator_key="type",
        discriminator_value="hello"
    )
    
    client.register_on_event_handler(
        handle_event_message,
        discriminator_key="type",
        discriminator_value="events_api" 
    )
    
    client.register_on_disconnect_message_handler(
        handle_disconnect_message,
        discriminator_key="type",
        discriminator_value="disconnect"
    )

    client.connect()

    # Keep program alive for a while to allow message processing
    time.sleep(1000)


main()