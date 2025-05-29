---
"@asyncapi/generator": minor
---

### What's New

- Introduced a new `conditionalGeneration` configuration for templates.
- Supports conditional generation of both files and folders.
- Enables conditions based on values from the AsyncAPI document (`subject`) and custom template `parameters`.
- The **`parameter`** allows users to pass custom flags or values at generation time (via the CLI or programmatically) to control what parts of the template get rendered.
-  **Updating `.ageneratorrc` with more configuration** to sync the configuration changes due to conditionalGeneration property in template.

Earlier, the `.ageneratorrc` file looks:
```yaml
renderer: react
apiVersion: v3
generator: ">=1.3.0 <3.0.0"
parameters:
  server:
    description: The name of the server described in AsyncAPI document
    required: true
  clientFileName:
    description: The name of the generated client file
    required: false
    default: client.py
  appendClientSuffix:
    description: Add 'Client' suffix at the end of the class name. This option has no effect if 'customClientName' is specified.
    required: false
    default: false  
  customClientName:
    description: The custom name for the generated client class
    required: false
```
Now after the introduction of conditionalGeneration the `.ageneratorrc` file looks:

```yaml
renderer: react
apiVersion: v3
hooks:
  "@asyncapi/generator-hooks": createAsyncapiFile
parameters:
  version:
    description: "Custom version to be used"
  mode:
    description: "development or production"
  asyncapiFileDir:
    description: >
      This template by default also outputs the AsyncAPI document that was passed as input. 
      You can specify with this parameter what should be the location of this AsyncAPI document, 
      relative to specified template output.
  singleFile:
    description: "Allow to generate conditionalGeneration file only if singleFile is set to false"
  singleFolder:
    description: "Allow to generate conditionalGeneration folder only if singleFolder is set to false"
conditionalGeneration:
  conditionalFolder:
    parameter: singleFolder
    validation:
      not:
        const: "true"
  conditionalFile.txt:
    parameter: singleFile
    validation:
      not:
        const: "true"
  conditionalFolder2/input.txt:
    parameter: singleFile
    validation:
      enum: ["false"]

```

### Deprecation notice

- The existing `conditionalFile` configuration is now deprecated and will be removed in a future release.
- To migrate, replace `conditionalFile` with `conditionalGeneration` in your template configuration.