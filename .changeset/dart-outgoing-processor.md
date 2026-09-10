---
"@asyncapi/generator": minor
"@asyncapi/generator-components": minor
---

Add outgoing-processor support to the Dart WebSocket client: `registerOutgoingProcessor()` registers processors that run on each message before it is sent, and the generated example shows a sample processor. The `RegisterOutgoingProcessor` component is now shared in `@asyncapi/generator-components` and reused by the Python, JavaScript, and Dart clients.
