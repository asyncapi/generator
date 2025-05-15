---
"@asyncapi/generator": minor
---
### What's new

- Introduced a new `conditionalGeneration` configuration for template authors.
- Supports conditional generation of both files and folders.
- Allows conditions based on values from the AsyncAPI document (`subject`) and custom template `parameters`.

### Deprecation notice

- The existing `conditionalFile` configuration is now deprecated and will be removed in a future release.
- To migrate, replace `conditionalFile` with `conditionalGeneration` in your template configuration.
- Note: The structure has changed — `conditionalGeneration` introduces a `parameter` key alongside `subject` for more flexible condition definitions.