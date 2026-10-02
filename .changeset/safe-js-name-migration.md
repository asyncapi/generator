---
"@asyncapi/generator-helpers": minor
"@asyncapi/generator-components": minor
"@asyncapi/generator": minor
---

Migrate `getSafeJSName` to `@asyncapi/generator-helpers` using `@babel/helper-validator-identifier` for keyword detection. Deduplicate `CONSTRUCTOR_RESERVED_NAMES` into a shared constants module.
