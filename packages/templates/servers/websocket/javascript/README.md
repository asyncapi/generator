## Node.js WebSocket Server Template

This baked-in template generates a modern Node.js WebSocket server based on an AsyncAPI document.

### Features

- **Multi-channel Route Dispatching**: Dynamically maps WebSocket connections to channel routes defined in the AsyncAPI document.
- **Runtime Message Validation**: Validates inbound and outbound message payloads against schemas using `@asyncapi/keeper`.
- **Per-Channel Connection Management**: Automatically tracks active clients per channel and provides broadcast and direct messaging.
- **Configurable Lifecycle**: Clean `start()` and `stop()` lifecycle methods with error handling hooks and connection listeners.

### Template Parameters

- `server`: Optional server name from the AsyncAPI document.
- `port`: Listening port for the generated server (default: `8080`).
- `serverFileName`: Output filename for the generated server (default: `server.js`).
- `packageJsonFileName`: Output filename for the generated package.json (default: `package.json`).
- `asyncapiFileDir`: Location of the source AsyncAPI document in the output directory (default: `.`).
