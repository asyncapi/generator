# @asyncapi/generator

## 3.1.2

### Patch Changes

- 4a09f57: Bump @asyncapi/parser to 3.6.0 to support AsyncAPI 3.1.0

## 3.1.1

### Patch Changes

- 2bfad27: Fix generator handling of template parameters with `false` default values, ensuring defaults are correctly injected and conditional generation works as expected.

## 3.1.0

### Minor Changes

- 11a1b8d: - **Updated Component**: `OnMessage` (Python) - Added discriminator-based routing logic that automatically dispatches messages to operation-specific handlers before falling back to generic handlers

  - **New Helpers**:
    - `getMessageDiscriminatorData` - Extracts discriminator key and value from individual messages
    - `getMessageDiscriminatorsFromOperations` - Collects all discriminator metadata from receive operations
  - Enhanced Python webSocket client generation with **automatic operation-based message routing**:

  ## How python routing works

  - Generated WebSocket clients now automatically route incoming messages to operation-specific handlers based on message discriminators. Users can register handlers for specific message types without manually parsing or filtering messages.
  - When a message arrives, the client checks it against registered discriminators (e.g., `type: "hello"`, `type: "events_api"`)
  - If a match is found, the message is routed to the specific operation handler (e.g., `onHelloMessage`, `onEvent`)
  - If no match is found, the message falls back to generic message handlers
  - This enables clean separation of message handling logic based on message types

  > `discriminator` is a `string` field that you can add to any AsyncAPI Schema. This also means that it is limited to AsyncAPI Schema only, and it won't work with other schema formats, like for example, Avro.

  The implementation automatically derives discriminator information from your AsyncAPI document:

  - Discriminator `key` is extracted from the `discriminator` field in your AsyncAPI spec
  - Discriminator `value` is extracted from the `const` property defined in message schemas

  Example AsyncAPI Schema with `discriminator` and `const`:

  ```yaml
  schemas:
    hello:
      type: object
      discriminator: type # you specify name of property
      properties:
        type:
          type: string
          const: hello # you specify the value of the discriminator property that is used for routing
          description: A hello string confirming WebSocket connection
  ```

  ## Fallback

  When defaults aren't available in the AsyncAPI document, users must provide **both** `discriminator_key` and `discriminator_value` when registering handlers. Providing only one parameter is not supported - you must provide either both or neither.

  > **Why this limitation exists**: When a receive operation has multiple messages sharing the same discriminator key (e.g., all use `"type"` field), we need the specific value (e.g., `"hello"`, `"disconnect"`) to distinguish between them. Without both pieces of information, the routing becomes ambiguous.

  Example:

  ```python
  # Default case - discriminator info auto-derived from AsyncAPI doc
  client.register_on_hello_message_handler(my_handler)

  # Custom case - must provide both key AND value
  client.register_on_hello_message_handler(
      my_handler,
      discriminator_key="message_type",
      discriminator_value="custom_hello"
  )
  ```

### Patch Changes

- Updated dependencies [11a1b8d]
  - @asyncapi/generator-components@0.5.0
  - @asyncapi/generator-helpers@1.1.0

## 3.0.1

### Patch Changes

- c5be81a: Enforce new helpers and components release to use latest versions in generator. Required because of the recent misconfiguration of releases and Trusted Publishing.
- Updated dependencies [c5be81a]
  - @asyncapi/generator-helpers@1.0.1
  - @asyncapi/generator-components@0.4.1

## 3.0.0

### Major Changes

- df08ae7: ### Breaking Changes

  - You must use Node.js 24.11 or higher, and NPM 11.5.1 or higher
  - Nunjucks renderer removed — React is now the sole rendering engine. No need to specify render engine in config anymore
  - Nunjucks filters package and its public filters removed; filter-based template APIs no longer available.
  - `ag` CLI is no longer available. It was announced some time ago that it would be deprecated, and users are encouraged to switch to the [AsyncAPI CLI](https://github.com/asyncapi/cli/)

  ### Migration Guides

  - [Migrating from Nunjucks to React render engine](https://github.com/asyncapi/generator/blob/%40asyncapi/generator%402.8.4/apps/generator/docs/migration-nunjucks-react.md)
  - [Migrating from `ag` CLI to AsyncAPI CLI](https://github.com/asyncapi/generator/blob/%40asyncapi/generator%402.8.4/apps/generator/docs/migration-cli.md)

### Patch Changes

- Updated dependencies [df08ae7]
  - @asyncapi/generator-helpers@1.0.0

## 2.11.0

### Minor Changes

- ced1404: Pushing of release https://github.com/asyncapi/generator/pull/1747 that failed due to pipeline issues.

## 2.10.0

### Minor Changes

- aee45ba: Pushing of release https://github.com/asyncapi/generator/pull/1747 that failed due to pipeline issues.

## 2.9.0

### Minor Changes

- 8168bcd: Pushing of release https://github.com/asyncapi/generator/pull/1747 that failed due to pipeline issues.

## 2.8.4

### Patch Changes

- 91735c3: Fix invalid Java method name generation and properly handle multiple WebSocket handlers

  - Generate valid Java method names for WebSocket operation handlers with strange identifiers.
  - Produce distinct @OnTextMessage handler methods for each send operation and add safe default routing for unrecognized messages.
  - Update onClose/onOpen formatting.

- Updated dependencies [91735c3]
  - @asyncapi/generator-components@0.3.1

## 2.8.3

### Patch Changes

- d84e110: First release of the generator including `@asyncapi/generator-components` and `@asyncapi/generator-helpers` packages.

## 2.8.2

### Patch Changes

- 4394d90: Ensure transpiled baked-in templates are published to npm. Fixing missing `react-sdk` build.

## 2.8.1

### Patch Changes

- 190ebc9: Ensure transpiled baked-in templates are published to npm.

## 2.8.0

### Minor Changes

- 6550745: This release introduces the concept of [`Baked-in Templates`](https://www.asyncapi.com/docs/tools/generator/baked-in-templates).

  List of currently available baked-in templates is located in [BakedInTemplatesList.json](https://github.com/asyncapi/generator/blob/master/apps/generator/lib/templates/BakedInTemplatesList.json) file that is dynamically regenerated on each release.

  ### 🚀 New Experimental Feature: **Baked-in Templates**

  Baked-in Templates are **official AsyncAPI templates that are developed, versioned, and shipped directly inside the `generator` repository**, and are exposed via the `@asyncapi/generator` library. This approach provides a faster, more consistent, and opinionated way to generate code, SDKs, clients, and more—without relying on external packages.

  All baked-in templates live under the `packages/templates` directory, follow a strict folder structure for maintainability, and are automatically registered in the generator during build time.

  ### ⚠️ Important Notes

  - **Experimental**: Baked-in templates are **not recommended for production use yet**. The number of available templates is currently limited, and we’re actively refining the concept.
  - **We need your feedback**: Try them out with your AsyncAPI documents and share your use cases to help us improve them.
  - **No changes to existing templates**: Your current workflow with external templates remains fully supported and works exactly the same as before. Nothing breaks, nothing changes.

  ### Benefits

  - Such templates are versioned together with the generator → no mismatches.
  - Faster template discovery and generation process.
  - Clear naming conventions and metadata, making templates easier to maintain and extend.

  ### What’s Next

  - We’ll be gradually expanding template coverage (e.g., docs, configs, SDKs) and stabilizing this feature based on community input before recommending production use.

  - Dedicated support for such templates will be enabled in AsyncAPI CLI. [The PR](https://github.com/asyncapi/cli/pull/1830) is already opened.

## 2.7.1

### Patch Changes

- a51f90e: Release of `generator-react-sdk` as part of the `generator` monorepo.

  With this release the code from https://github.com/asyncapi/generator-react-sdk is considered to be an archive, and all future development will take place in this repository under `/apps/react-sdk`.

- Updated dependencies [a51f90e]
  - @asyncapi/generator-react-sdk@1.1.3

## 2.7.0

### Minor Changes

- 802ad41: ### What's New

  - Introduced a new `conditionalGeneration` configuration for templates.
  - Supports conditional generation of both files and folders.
  - Enables conditions based on values from the AsyncAPI document (`subject`) and custom template `parameters`.
  - The **`parameter`** allows users to pass custom flags or values at generation time (via the CLI or programmatically) to control what parts of the template get rendered.
  - **Addition of new config file `.ageneratorrc`**: Previously, generator configuration had to be defined in the `package.json` file. Now, you can define the configuration in a separate `.ageneratorrc` file. The configuration defined in the `.ageneratorrc` file will override any configuration defined in `package.json`. The generator will first check for the `.ageneratorrc` file in the template's root directory, and if not found, it will look for the generator config in `package.json`.

  The `.ageneratorrc` file should be in YAML format.

  Earlier, the `package.json` for the Python WebSocket client looked like this:

  ```json
  {
    "name": "@asyncapi/template-python-websocket-client",
    "version": "0.0.1",
    "description": "This is a template generating Python websocket client",
    // ...other configuration...
    "generator": {
      "renderer": "react",
      "apiVersion": "v3",
      "generator": ">=1.3.0 <3.0.0",
      "parameters": {
        "server": {
          "description": "The name of the server described in AsyncAPI document",
          "required": true
        },
        "clientFileName": {
          "description": "The name of the generated client file",
          "required": false,
          "default": "client.py"
        },
        "appendClientSuffix": {
          "description": "Add 'Client' suffix at the end of the class name. This option has no effect if 'customClientName' is specified.",
          "required": false,
          "default": false
        },
        "customClientName": {
          "description": "The custom name for the generated client class",
          "required": false
        }
      }
    }
  }
  ```

  Now after the introduction of the `.ageneratorrc` file, the `package.json` can be simplified by removing the generator configuration:

  ```json
  {
    "name": "@asyncapi/template-python-websocket-client",
    "version": "0.0.1",
    "description": "This is a template generating Python websocket client",
    "scripts": {
      "test": "npm run test:cleanup && jest --coverage",
      "test:update": "npm run test -- -u",
      "test:cleanup": "rimraf \"test/temp\"",
      "lint": "eslint --max-warnings 0 --config ../../../../../.eslintrc --ignore-path ../../../../../.eslintignore .",
      "lint:fix": "eslint --fix --max-warnings 0 --config ../../../../../.eslintrc --ignore-path ../../../../../.eslintignore ."
    },
    "author": "Lukasz Gornicki <lpgornicki@gmail.com>",
    "license": "Apache-2.0",
    "dependencies": {
      "@asyncapi/generator-react-sdk": "^1.1.2",
      "@asyncapi/generator-helpers": "1.0.0"
    },
    "devDependencies": {
      "@asyncapi/parser": "^3.0.14",
      "@babel/cli": "^7.25.9",
      "@babel/core": "^7.26.0",
      "@babel/preset-env": "^7.26.0",
      "@babel/preset-react": "^7.25.9",
      "jest-esm-transformer": "^1.0.0",
      "@asyncapi/generator": "*",
      "eslint": "^6.8.0",
      "eslint-plugin-jest": "^23.8.2",
      "eslint-plugin-react": "^7.34.1",
      "eslint-plugin-sonarjs": "^0.5.0",
      "rimraf": "^3.0.2"
    },
    "jest": {
      "moduleFileExtensions": ["js", "json", "jsx"],
      "transform": {
        "^.+\\.jsx?$": "babel-jest"
      },
      "moduleNameMapper": {
        "^nimma/legacy$": "<rootDir>/../../../../../node_modules/nimma/dist/legacy/cjs/index.js",
        "^nimma/(.*)": "<rootDir>/../../../../../node_modules/nimma/dist/cjs/$1"
      }
    },
    "babel": {
      "presets": [
        "@babel/preset-env",
        [
          "@babel/preset-react",
          {
            "runtime": "automatic"
          }
        ]
      ]
    }
  }
  ```

  And the equivalent `.ageneratorrc` file would be:

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

  ### Deprecation notice

  - The existing `conditionalFile` configuration is now deprecated and will be removed in a future release.
  - To migrate, replace `conditionalFile` with `conditionalGeneration` in your template configuration.

## 2.6.0

### Minor Changes

- fd5dfd7: - **Deprecation of `ag` CLI**: The `ag` CLI is deprecated in favour of the `AsyncAPI CLI` that is a single entry point for all the AsyncAPI tools. No new features will be added to `ag` and it will be completely removed. The official documentation of AsyncAPI Generator has not mentioned `ag` for over a year, instead only using `AsyncAPI CLI` and `asyncapi generate fromTemplate` commands. Refer to the [migration guide](https://www.asyncapi.com/docs/tools/generator/migration-cli) that will help you understand how to migrate your `ag` commands to the new `AsyncAPI CLI` command.

  - **Deprecation of Nunjucks render engine:** The [Nunjucks render engine](https://www.asyncapi.com/docs/tools/generator/nunjucks-render-engine) is deprecated and will be removed in October 2025. It is recommended to switch to the [React render engine](https://www.asyncapi.com/docs/tools/generator/react-render-engine) instead. If you are using Nunjucks in production, read the [migration guide](https://www.asyncapi.com/docs/tools/generator/migration-nunjucks-react) that will help you understand how to migrate to the new engine. The removal of the Nunjucks render engine results also in removal of [Nunjucks-filters](apps/nunjucks-filters) library.

  Removal of both deprecated parts of the generator is planned for October 2025, which gives you 9 months to migrate.

## 2.5.0

### Minor Changes

- 2d16234: - Package `@asyncapi/generator-hooks` is now part of `generator` repo and won't be released separately. Theource code is stored under `apps/hooks` but the `package/library` name stays as it was originally for backward compatibility,
  - By default, the `@asyncapi/generator-hooks` package, known as **package** contains many different hooks used in templates and is available in the generator. You no longer have to configure it in your `package.json` in `dependencies`. The package, `@asyncapi/generator-hooks` will no longer be published to NPM separately and is deprecated. You can still have your own hooks, store them in a separate package, and configure them with your template.
  - Remember that the fact that the hooks package is now included by default, doesn't mean all hooks from it are enabled by default. You still have to enable a given hook in the configuration file explicitly because some hooks can execute automatically without passing a specific parameter. Also, a hook's supported parameters need to be defined in your template's config.

## 2.4.1

### Patch Changes

- 3a372c4: Removed the source-map-support package from the AsyncAPI Generator, as it is no longer required for version 2, which now supports Node.js version 18.12.0 and above.

## 2.4.0

### Minor Changes

- 46114d8: Add `compile` option to enable rerun of transpilation of templates build with react engine. It is set to `true` by default. In future major releases it will be set to `false` and we will explain how to publish template to include transpilation files by default. Transpiled files are already included in [`html-template`](https://github.com/asyncapi/html-template/pull/575). It means that you can run generator for `html-template` (it's latest version) with `compile=false` and this will improve the speed of HTML generation for you.

## 2.3.0

### Minor Changes

- 44fcc33: ts-node is registered only when it's actually needed

## 2.2.0

### Minor Changes

- 81dfd0c: Enable `noOverwriteGlobs` option for templates based on react rendering engine.

## 2.1.3

### Patch Changes

- 93fb8e8: Updated the method for importing the Nunjucks filter dependency

## 2.1.2

### Patch Changes

- a3e93ef: update the git context for the docker versioning.

## 2.1.1

### Patch Changes

- 36ee8a8: Fix docker image publishing. Removed package name from version tag for Docker tagging.

## 2.1.0

### Minor Changes

- 99a14a8: - New release pipeline supporting monorepo,
  - Package `@asyncapi/generator-filters` is now part of `generator` repo and won't be released separately. New name of the library is `nunjuckis-filters`,
  - By default `@asyncapi/generator-filters` package, known as package with a lot of different nunjucks filters, is registered and added to generator and you no longer have to configure it in your `package.json`. Package `@asyncapi/generator-filters` will no longer be published to NPM separately and is deprecated.
