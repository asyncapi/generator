# Authoring templates

The AsyncAPI generator has been built with extensibility in mind. The package uses a set of default templates to let you generate documentation and code. However, you can create and use your own templates. In this section, you learn how to create your own one.

## Common assumptions

1. A template is a directory in your file system.
1. The template can have own dependencies. Just create `package.json` for the template. The generator makes sure to trigger the installation of dependencies.
1. Templates may contain multiple files. Unless stated otherwise, all files will be rendered.
1. The template engine is [Nunjucks](https://mozilla.github.io/nunjucks).
1. Templates may contain `filters` or helper functions. They must be stored in the `.filters` directory under the template directory. [Read more about filters](#filters).
1. Templates may contain `hooks` that are functions invoked after the generation. They must be stored in the `.hooks` directory under the template directory. [Read more about hooks](#hooks).
1. Templates may contain `partials` (reusable chunks). They must be stored in the `.partials` directory under the template directory. [Read more about partials](#partials).
1. Templates may have a configuration file. It must be stored in the template directory and its name must be `.tp-config.json`. [Read more about the configuration file](#configuration-file).
1. There are parameters with special meaning. [Read more about special parameters](#special-parameters).
1. The default variables you have access to in any the template file are the following:
   - `asyncapi` that is a parsed spec file object. Read the [API](https://github.com/asyncapi/parser-js/blob/master/API.md#AsyncAPIDocument) of the Parser to understand to what structure you have access in this parameter.
   - `originalAsyncAPI` that is an original spec file before it is parsed. 
1. To separate functionality into files, you can specify a filename like `$$channel$$.js` to generate a file for each channel defined in your AsyncAPI document. Such files templating gives you access to the following extra variables:
   - When using `$$channel$$` you have access to two variables `channel` and `channelName`. Where `channel` contains the current channel being rendered.
   - When using `$$message$$` you have access to two variables `message` and `messageName`. Where `message` contains the current message being rendered.
   - When using `$$schema$$` you have access to two variables `schema` and `schemaName`. Where `schema` contains the current schema being rendered.
   - When using `$$parameter$$` you have access to two variables `parameter` and `parameterName`. Where `parameter` contains the current parameter being rendered.
   - When using `$$securityScheme$$` you have access to two variables `securityScheme` and `securitySchemeName`. Where `securityScheme` contains the current security scheme being rendered.
   
## Filters

A filter is a helper function that you can create to perform complex tasks. They are JavaScript files that register one or many [Nunjuck filters](https://mozilla.github.io/nunjucks/api.html#custom-filters). The generator will parse all the files in the `.filters` directory.

Each file must export a function that will receive the following parameters:

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

An example filter called `camelCase` which uses the Lodash function `_.camelCase(String)` to convert a template string as camel case:

```js
module.exports = ({ Nunjucks, _, Markdown, OpenAPISampler }) => {
  Nunjucks.addFilter('camelCase', (str) => {
    return _.camelCase(str);
  });
};
```

And then you can use the filter in your template as follows:

```js
const {{ channelName | camelCase }} = '{{ channelName }}';
```

## Hooks

Hooks are functions called by the generator on a specific moment in the generation process. For now there is one hook supported called `generate:after` that is called at the very end of the generation. The generator will parse all the files in the `.hooks` directory.

Below you have an example Hook that after generation creates an AsyncAPI file.

```js
const fs = require('fs');
const path = require('path');

module.exports = register => {
  register('generate:after', generator => {
    const asyncapi = generator.originalAsyncAPI;
    let extension;

    try {
      JSON.parse(asyncapi);
      extension = 'json';
    } catch (e) {
      extension = 'yaml';
    }

    fs.writeFileSync(path.resolve(generator.targetDir, `asyncapi.${extension}`), asyncapi);
  });
};
```

## Partials

Files from the `.partials` directory do not end up with other generated files in the target directory. In this directory you should keep reusable templates chunks that you can [include](https://mozilla.github.io/nunjucks/templating.html#include) in your templates. You can also put there [macros](https://mozilla.github.io/nunjucks/templating.html#macro) to use them in templates, like in below example:

```html
{# tags.html #}
{% macro tags(tagList) %}
<div class="mt-4">
  {% for tag in tagList %}
    <span class="bg-grey-dark font-normal text-sm no-underline text-white rounded lowercase mr-2 px-2 py-1" title="{{tag.description()}}">{{tag.name()}}</span>
  {% endfor %}
</div>
{% endmacro %}

{# operations.html #}
{% from "./tags.html" import tags %}
{{ tags(operation.tags()) }}
```

## Configuration File

The `.tp-config.json` file contains a JSON object that may have the following information:

|Name|Type|Description|
|---|---|---|
|`supportedProtocols`| [String] | A list with all the protocols this template supports.
|`parameters`| Object[String, Object] | An object with all the parameters that can be passed when generating the template. When using the command line, it's done by indicating `--param name=value` or `-p name=value`.
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

## Special parameters

There are some template parameters that have a special meaning:

|Name|Description|
|---|---|
|`server`| It is used to let the template know which server you want to use. In some cases, this may be required. For instance, when generating code that connects to a specific server. If your template need your users to specify a server, use this parameter.
