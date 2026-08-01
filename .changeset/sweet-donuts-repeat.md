---
"@asyncapi/generator-react-sdk": patch
---

Use the `new Array()` constructor form in the react-sdk string utilities instead of calling `Array()` without `new`, as flagged by SonarCloud. Behaviour is unchanged.
