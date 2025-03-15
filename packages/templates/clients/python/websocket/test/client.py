import asyncio
import websockets
import json
import ssl
import certifi

class HoppscotchEchoClient:
    def __init__(self, url="wss://echo-websocket.hoppscotch.io"):
        self.url = url
        self.message_handlers = []
        self.error_handlers = []
        self.outgoing_processors = []

    async def connect(self):
        """Connect to the WebSocket server and listen for messages."""
        try:
            ssl_context = ssl.create_default_context(cafile=certifi.where())

            async with websockets.connect(self.url, ssl=ssl_context) as websocket:
                print("Connected to WebSocket server")
                async for message in websocket:
                    await self.handle_message(message)
        except Exception as error:
            await self.handle_error(error)

    async def send_message(self, message):
        """Send a message, allowing optional preprocessing."""
        if self.outgoing_processors:
            for processor in self.outgoing_processors:
                message = await processor(message)  # Process message before sending

        try:
            async with websockets.connect(self.url) as websocket:
                await websocket.send(json.dumps(message))
                print(f"Sent: {message}")

                response = await websocket.recv()
                await self.handle_message(response)
        except Exception as error:
            await self.handle_error(error)

    async def handle_message(self, message):
        """Process incoming messages with registered handlers."""
        print(f"Received: {message}")
        for handler in self.message_handlers:
            await handler(message)

    async def handle_error(self, error):
        """Handle errors using registered error handlers."""
        print(f"WebSocket Error: {error}")
        for handler in self.error_handlers:
            await handler(error)

    def register_message_handler(self, handler):
        """Register a custom message handler."""
        if callable(handler):
            self.message_handlers.append(handler)
        else:
            print("Message handler must be a callable function")

    def register_error_handler(self, handler):
        """Register a custom error handler."""
        if callable(handler):
            self.error_handlers.append(handler)
        else:
            print("Error handler must be a callable function")

    def register_outgoing_processor(self, processor):
        """Register a function that modifies outgoing messages."""
        if callable(processor):
            self.outgoing_processors.append(processor)
        else:
            print("Outgoing processor must be a callable function")

    async def run(self):
        """Run both sender and listener in parallel."""
        listener_task = asyncio.create_task(self.connect())
        sender_task = asyncio.create_task(self.send_message({"message": "Hello, WebSocket!"}))

        await asyncio.gather(listener_task, sender_task)