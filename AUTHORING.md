# Authoring templates

The AsyncAPI generator has been built with extensibility in mind. The package uses a set of default templates to let you generate documentation and code. However, you can create and use your own templates. In this section, we'll learn how to create your own one.

## Common assumptions

1. A template is a directory in your file system.
1. Templates may contain multiple files. Unless stated otherwise, all files will be rendered.
1. The template engine is [Nunjucks](https://mozilla.github.io/nunjucks).
1. Templates may contain "partials" or reusable chunks. They must be stored in the `.partials` directory under the template directory.
1. Templates may contain "filters" or helper functions. They must be stored in the `.filters` directory under the template directory. [Read more about filters](#filters).
1. Templates may have a configuration file. It must be stored in the template directory and its name must be `.tp-config.json`. [Read more about the configuration file](#configuration-file).
1. There are params with special meaning. [Read more about special params](#special-params).

## Filters

A filter is a helper function that you can create to perform complex tasks. They are JavaScript files that register one or many [Nunjuck filters](https://mozilla.github.io/nunjucks/api.html#custom-filters). The generator will parse all the files in the `.filters` directory.

Each file must export a function that will receive the following params:

* `Nunjucks`: a reference to the [Nunjucks](https://mozilla.github.io/nunjucks) template engine used internally by the generator.
* `_`: a convenient [Lodash](https://www.lodash.com) reference.
* `Markdown`: a reference to the [markdown-it](https://github.com/markdown-it/markdown-it) package. Use it to convert Markdown to HTML.
* `OpenAPISampler`: a reference to the [openapi-sampler](https://github.com/Redocly/openapi-sampler) package. It generates examples from OpenAPI/AsyncAPI schemas.

The common structure for one of these files is the following:

```js
module.exports = ({ Nunjucks, _, Markdown, OpenAPISampler }) => {
  Nunjucks.addFilter('yourFilterName', (yourFilterParams) => {
    return 'doSomething';
  });
};
```

For example:

```js
module.exports = ({ Nunjucks, _, Markdown, OpenAPISampler }) => {
  Nunjucks.addFilter('camelCase', (str) => {
    return _.camelCase(str);
  });
  
  Nunjucks.addFilter('generateExample', (schema) => {
    return OpenAPISampler.sample(schema);
  });
};
```

And then you can use the filters in your template as follows:

```js
const {{ channelName | camelCase }} = '{{ channelName }}';
```

## Configuration File

The `.tp-config.json` file contains a JSON object that may have the following information:

|Name|Type|Description|
|---|---|---|
|`supportedProtocols`| [String] | A list with all the protocols this template supports.
|`parameters`| Object[String, Object] | An object with all the params that can be passed when generating the template. When using the command line, it's done by indicating `--param name=value` or `-p name=value`.
|`parameters[param].description`| String | A user-friendly description about the parameter.
|`parameters[param].required`| Boolean | Whether the parameter is required or not.
|`conditionalFiles`| Object[String, Object] | An object containing all the file paths that should be conditionally rendered. Each key represents a file path and each value must be an object with the keys `subject` and `validation`.
|`conditionalFiles[filePath].subject`| String | The `subject` is a [JMESPath](http://jmespath.org/) query to grab the value you want to apply the condition to. It queries an object with the whole AsyncAPI document and, when specified, the given server. The object looks like this: `{ asyncapi: { ... }, server: { ... } }`.
|`conditionalFiles[filePath].validation`| Object | The `validation` is a JSON Schema Draft 07 object. This JSON Schema definition will be applied to the JSON value resulting from the `subject` query. If validation doesn't have errors, the condition is met, and therefore the given file will be rendered. Otherwise, the file is ignored.
|`nonRenderableFiles`| [String] | A list of file paths or [globs](https://en.wikipedia.org/wiki/Glob_(programming)) that must be copied "as-is" to the target directory, i.e., without performing any rendering process. This is useful when you want to copy binary files.

### Example

```json
{
  "supportedProtocols": ["amqp", "mqtt"],
  "parameters": {
    "server": {
      "description": "The server you want to use in the code.",
      "required": true
    }
  },
  "conditionalFiles": {
    "src/api/adapters/amqp.js": {
      "subject": "server.protocol",
      "validation": {
        "const": "amqp"
      }
    },
    "src/api/adapters/mqtt.js": {
      "subject": "server.protocol",
      "validation": {
        "const": "mqtt"
      }
    }
  },
  "nonRenderableFiles": [
    "src/api/middlewares/*.*",
    "lib/lib/config.js"
  ]
}
```

## Special Params

There are some template parameters that have a special meaning:

|Name|Description|
|---|---|
|`server`| It is used to let the template know which server we want to use. In some cases, this may be required. For instance, when generating code that connects to a specific server. If your template need your users to specify a server, use this param.
