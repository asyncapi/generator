---
title: "Configuration file"
weight: 90
---

The `generator` property from `package.json` file must contain a JSON object that may have the following information:

|Name|Type|Description|
|---|---|---|
|`renderer`| String | Its value can be either `react` or `nunjucks` (default).
|`supportedProtocols`| [String] | A list with all the protocols this template supports.
|`parameters`| Object[String, Object] | An object with all the parameters that can be passed when generating the template. When using the command line, it's done by indicating `--param name=value` or `-p name=value`.
|`parameters[param].description`| String | A user-friendly description about the parameter.
|`parameters[param].default`| Any | Default value of the parameter if not specified. Shouldn't be used for mandatory `required=true` parameters.
|`parameters[param].required`| Boolean | Whether the parameter is required or not.
|`conditionalFiles`| Object[String, Object] | An object containing all the file paths that should be conditionally rendered. Each key represents a file path and each value must be an object with the keys `subject` and `validation`. The file path should be relative to the `template` directory inside the template.
|`conditionalFiles[filePath].subject`| String | The `subject` is a [JMESPath](http://jmespath.org/) query to grab the value you want to apply the condition to. It queries an object with the whole AsyncAPI document and, when specified, the given server. The object looks like this: `{ asyncapi: { ... }, server: { ... } }`. If the template supports `server` parameter, you can access server details like for example protocol this way: `server.protocol`. During validation with `conditionalFiles` only the server that template user selected is available in the specification file. For more information about `server` parameter [read about special parameters](#special-parameters).
|`conditionalFiles[filePath].validation`| Object | The `validation` is a JSON Schema Draft 07 object. This JSON Schema definition will be applied to the JSON value resulting from the `subject` query. If validation doesn't have errors, the condition is met, and therefore the given file will be rendered. Otherwise, the file is ignored. Check [JSON Schema Validation](https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.6) document for a list of all possible validation keywords.
|`nonRenderableFiles`| [String] | A list of file paths or [globs](https://en.wikipedia.org/wiki/Glob_(programming)) that must be copied "as-is" to the target directory, i.e., without performing any rendering process. This is useful when you want to copy binary files.
|`generator`| [String] | A string representing the generator version-range the template is compatible with. This value must follow the [semver](https://nodejs.dev/learn/semantic-versioning-using-npm) syntax. E.g., `>=1.0.0`, `>=1.0.0 <=2.0.0`, `~1.0.0`, `^1.0.0`, `1.0.0`, etc. [Read more about semver](https://docs.npmjs.com/about-semantic-versioning).
|`filters`| [String] | A list of modules containing functions that can be used as Nunjucks filters. In case of external modules, remember they need to be added as a dependency in `package.json` of your template.
|`hooks`| Object[String, String] or Object[String, Array[String]] | A list of modules containing hooks, except for the ones you keep locally in your template in default location. For each module you must specify the exact name of the hook that should be used in the template. For a single hook you can specify it as a string, for more you must pass an array of strings. In case of external modules, remember they need to be added as a dependency in `package.json` of your template.

### Example

```json
"generator":
{
  "renderer": "react",
  "supportedProtocols": ["amqp", "mqtt"],
  "parameters": {
    "server": {
      "description": "The server you want to use in the code.",
      "required": true
    },
    "dummyParameter": {
      "description": "Example of parameter with default value.",
      "default": "just a string",
      "required": false
    }
  },
  "conditionalFiles": {
    "path/to/file/that/is/relative/to/template/dir/test-amqp.js": {
      "subject": "server.protocol",
      "validation": {
        "const": "amqp"
      }
    },
    "path/to/file/that/is/relative/to/template/dir/support.html": {
      "subject": "info.contact",
        "validation": {
          "required": ["url"]
        }
    }
  },
  "nonRenderableFiles": [
    "src/api/middlewares/*.*",
    "lib/lib/config.js"
  ],
  "generator": "<2.0.0",
  "filters": [
    "@asyncapi/generator-filters"
  ],
  "hooks": {
    "@asyncapi/generator-hooks": "hookFunctionName"
  }
}
```

## Special parameters

There are some template parameters that have a special meaning:

|Name|Description|
|---|---|
|`server`| It is used to let the template know which server from the AsyncAPI specification file you want to use. In some cases, this may be required. For instance, when generating code that connects to a specific server. Use this parameter in case your template relies on users' information about what server from the specification file they want to use during generation. You also need this parameter if you want to use `server.protocol` notation within `conditionalFiles` configuration option. Once you decide to specify this parameter for your template, it is recommended you make it a mandatory parameter otherwise a feature like `conditionalFiles` is not going to work if your users do not use this parameter obligatory.


