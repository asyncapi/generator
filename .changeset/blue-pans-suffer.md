---
"@asyncapi/generator": minor
---

### What's New

- Introduced a new `conditionalGeneration` configuration for templates.
- Supports conditional generation of both files and folders.
- Enables conditions based on values from the AsyncAPI document (`subject`) and custom template `parameters`.
- The **`parameter`** allows users to pass custom flags or values at generation time (via the CLI or programmatically) to control what parts of the template get rendered.
-  **Updating `.ageneratorrc` with more configuration** to sync the configuration changes due to conditionalGeneration property in template.
-  **Addition of new config file `.ageneratorrc`**: Previously, generator configuration had to be defined in the `package.json` file. Now, you can define the configuration in a separate `.ageneratorrc` file. The configuration defined in the `.ageneratorrc` file will override any configuration defined in `package.json`. The generator will first check for the `.ageneratorrc` file in the template's root directory, and if not found, it will look for the generator config in `package.json`.

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
    "moduleFileExtensions": [
      "js",
      "json",
      "jsx"
    ],
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