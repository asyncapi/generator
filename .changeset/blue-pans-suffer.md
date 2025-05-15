---
"@asyncapi/generator": minor
---
### What's new

- Introduced a new `conditionalGeneration` configuration for template authors.
- Supports conditional generation of both files and folders.
- Allows conditions based on values from the AsyncAPI document (`subject`) and custom template parameters.

### Deprecation notice

- The existing `conditionalFile` configuration is now deprecated and will be removed in a future release.
- To migrate, rename `conditionalFile` to `conditionalGeneration` in your template configuration. The structure remains the same, with added flexibility in condition handling.
