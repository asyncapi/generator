import sys
import os
import time

sys.path.append(os.path.join(os.path.dirname(__file__), 'test'))

from temp.snapshotTestResult.custom_client_hoppscotch.client import HoppscotchClient

def custom_message_handler(message):
    print(f"\033[94mCustom processing of received message\033[0m: {message}")

def custom_error_handler(error):
    print(f"Custom error handling: {error}")

def outgoing_message_processor(message):
    # Modify message before sending (e.g., add a timestamp)
    print(f"\033[92mCustom processing of outgoing message\033[0m: {message}")
    return {"Processed outgoing message": message, "timestamp": "2025-03-13T12:00:00Z"}

def main():
    client = HoppscotchClient()
    client.register_message_handler(custom_message_handler)
    client.register_error_handler(custom_error_handler)
    client.register_outgoing_processor(outgoing_message_processor)

    client.connect()
    
    # Give some time for the connection to establish
    time.sleep(2)

    # Send multiple messages to test stream handling
    for i in range(5):
        message = f'Hello, Echo Yo! {i}'
        client.sendEchoMessage(message)
        time.sleep(2)  # Wait for a response

    # Keep program alive for a while to allow message processing
    time.sleep(10)

main()

