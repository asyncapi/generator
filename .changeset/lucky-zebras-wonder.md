---
"@asyncapi/generator-components": patch
"@asyncapi/generator": patch
---

Fix invalid Java method name generation and properly handle multiple WebSocket handlers

- Generate valid Java method names for WebSocket operation handlers with strange identifiers.
- Produce distinct @OnTextMessage handler methods for each send operation and add safe default routing for unrecognized messages.
- Update onClose/onOpen formatting.