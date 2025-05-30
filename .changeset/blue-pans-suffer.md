---
"@asyncapi/generator": minor
---

### What's New

- Introduced a new `conditionalGeneration` configuration for templates.
- Supports conditional generation of both files and folders.
- Enables conditions based on values from the AsyncAPI document (`subject`) and custom template `parameters`.
- The **`parameter`** allows users to pass custom flags or values at generation time (via the CLI or programmatically) to control what parts of the template get rendered.
-  **Updating `.ageneratorrc` with more configuration** to sync the configuration changes due to conditionalGeneration property in template.

### Deprecation notice

- The existing `conditionalFile` configuration is now deprecated and will be removed in a future release.
- To migrate, replace `conditionalFile` with `conditionalGeneration` in your template configuration.