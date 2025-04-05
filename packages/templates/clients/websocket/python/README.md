## Python WebSocket Client

You can test this template:
1. Clone the project and run `npm install`
2. Navigate to `packages/templates/clients/websocket/python`
3. Install with `npm install` and run test with `npm run test`
4. Install dependencies of the generated client: `pip install -r temp/snapshotTestResult/requirements.txt`
5. Start the example script that uses a generated client library: `python example.py`

> By default, this example tests the Postman Echo WebSocket service. You can modify `packages/templates/clients/websocket/python/example.py` and change the import line to `from temp.snapshotTestResult.client_hoppscotch import HoppscotchEchoWebSocketClient` and line 16 to `client = HoppscotchEchoWebSocketClient()`. Then run `python example.py` again — it will now test against the Hoppscotch API instead. This works because both AsyncAPI documents share the same operation name: `sendEchoMessage`, allowing interchangeable clients with a consistent API.
