import sys
import os
import time

sys.path.append(os.path.join(os.path.dirname(__file__), 'test'))

from temp.snapshotTestResult.client_slack.client import SlackWebsocketAPIClientClient

def custom_message_handler(message):
    print(f"\033[94mIncomming event from Slack\033[0m: {message}")

def main():
    client = SlackWebsocketAPIClientClient()
    client.register_message_handler(custom_message_handler)

    client.connect()

    # Keep program alive for a while to allow message processing
    time.sleep(1000)

main()