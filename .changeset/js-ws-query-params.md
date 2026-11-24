---
"@asyncapi/generator-helpers": minor
"@asyncapi/generator-components": minor
"@asyncapi/generator": minor
---

Add query-parameter support to the JavaScript WebSocket client, enabling generation of a Slack client.

- `@asyncapi/generator`: the generated JavaScript WebSocket client now accepts the channel's query parameters (e.g. Slack's `ticket` and `app_id`) as constructor arguments, placed between `url` and `throwSendErrors`, and appends them to the connection URL. A query parameter left as `undefined` falls back to its environment variable (e.g. `APP_ID`).
- `@asyncapi/generator-helpers`: new `getSafeJSName(name, usedNames)` helper that turns a query parameter name into a valid, unique JavaScript identifier.
- `@asyncapi/generator-components`: `QueryParamsVariables` with `language="javascript"` now outputs camelCase identifiers (e.g. `topOfBook`) and falls back to the environment variable only when the value is `null` or `undefined`.
