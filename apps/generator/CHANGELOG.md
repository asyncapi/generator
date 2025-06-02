# @asyncapi/generator

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
