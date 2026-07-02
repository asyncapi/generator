---
"@asyncapi/generator": patch
"@asyncapi/generator-components": patch
---

Avoid resolving deprecated or wildcard AsyncAPI workspace dependencies from npm by bundling the official hooks in the generator and pinning current internal package ranges.
