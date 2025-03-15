from client import HoppscotchEchoClient
import asyncio

async def custom_message_handler(message):
    print(f"Custom processing of received message: {message}")

async def custom_error_handler(error):
    print(f"Custom error handling: {error}")

async def outgoing_message_processor(message):
    # Modify message before sending (e.g., add a timestamp)
    return {"Processed message": message, "timestamp": "2025-03-13T12:00:00Z"}

async def main():
    client = HoppscotchEchoClient()
    client.register_message_handler(custom_message_handler)
    client.register_error_handler(custom_error_handler)
    client.register_outgoing_processor(outgoing_message_processor)

    await client.run()

asyncio.run(main())
