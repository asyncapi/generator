---
title: "Baked-in Templates"
weight: 55
---

> This is a new concept introduced in generator version 2.8. The number of templates is limited and solution is still in experimental phase

Baked-in templates are official AsyncAPI templates that are **developed, versioned, and shipped directly inside the `generator` repository and exposed with `@asyncapi/generator` library**.

AsyncAPI Generator supports a variety of baked-in template types for generating code, documentation, configs, and SDKs. All templates are managed under the `packages/templates` directory and follow a strict, opinionated directory structure for consistency and ease of maintenance.

## Supported template types

Templates are grouped by **type**, which must be one of the following:

- `docs`: Templates that generate documentation
- `client`: Templates that generate clients
- `sdk`: Template that generate full sdk's
- `config`: Template that generate configuration files

> **Note:**  
> The **directory name is always plural** (e.g., `clients`), but the **type recorded in metadata and package name is singular** (e.g., `client`), except for `docs`.

## Template directory structure

### General structure

All template directories must follow this convention:
```
packages/templates/{type}/[protocol]/[target]/[stack]
```

- `type`: One of `docs`, `clients`, `sdks`, or `configs`.
- `protocol`: (Only for `clients` and `sdks`) The protocol this template supports, e.g. `websocket`, `http`, `kafka`.
- `target`: The output language, markup, or format, e.g. `javascript`, `python`, `html`, `yaml`.
- `stack`: (Optional, for `clients` and `sdks`) Used for technology stack, e.g. `express`, `quarkus`.

#### Type-specific Rules

- **docs/configs**:  
  Path must be `type/target` (e.g., `docs/html` or `configs/yaml`).
- **clients/sdks**:  
  Path must be `type/protocol/target` or `type/protocol/target/stack` (e.g., `clients/websocket/javascript`, `sdks/kafka/java/spring`).

### Required Files

Every template directory **must include**:
- `.ageneratorrc`: Generator specific configuration, like for example parameters
- `package.json`: It contains template name. Version information should not be provided as it is versioned together with the generator.

## Metadata and Naming Conventions

Generator runs a script will normalize metadata for baked-in templates and their naming:
- Adds/updates metadata in `.ageneratorrc` file.
- Validates/updates template name in `package.json` file of given template
- Generates JSON file with list of baked in templates and stores the list inside the generator

#### Example

Example information provided for template stored under `packages/templates/clients/websocket/javascript/express`

```yaml
# .ageneratorrc
metadata:
  type: client
  protocol: websocket
  target: javascript
  stack: express
```

Package name format:  `@asyncapi/core-template-client-websocket-javascript-express`

## How to Add a New Template

1. Create the directory in `packages/templates` using the correct structure.
   - For a docs template:  
     `packages/templates/docs/html`
   - For a clients template:  
     `packages/templates/clients/websocket/rust`
1. Add required files:  
   - `.ageneratorrc` (do not add `generator` config key as it is not needed)
   - `package.json`
1. If template is ready to be exposed through the generator, add the template to generator's dependencies like for example:
    ```
    "@asyncapi/core-template-client-websocket-rust": "*"
    ```
1. Run generator's build command: `npm run build`