---
"@asyncapi/generator": minor
---

The WebSocket JavaScript template now emits a spec-aware `example.js` next to the generated client. The example uses the real exported client class (no opaque `WSClient` alias), iterates the spec's send operations with payloads from `message.examples()`, registers the outgoing processor only when send operations exist, runs a bounded 5-iteration send loop instead of an infinite `while(true)`, and closes the connection in a `finally` block. A new `exampleFileName` parameter (default `example.js`) overrides the output filename. The legacy hardcoded `packages/templates/clients/websocket/javascript/example.js` remains in place for this release; it will be removed in a follow-up.
