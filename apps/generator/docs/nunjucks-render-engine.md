---
title: "Nunjucks render engine"
weight: 120
---

> **Note**: Nunjucks renderer engine is deprecated and will be removed in the future. Use the React renderer engine instead. For more details read notes from release [@asyncapi/generator@2.6.0](https://github.com/asyncapi/generator/releases/tag/%40asyncapi%2Fgenerator%402.6.0).

[Nunjucks](https://mozilla.github.io/nunjucks) is the default render engine, however, we strongly recommend adopting the [React](#react) engine.

### Common assumptions

1. Templates may contain [Nunjucks filters or helper functions](https://mozilla.github.io/nunjucks/templating.html#builtin-filters). [Read more about filters](#filters).
1. Templates may contain `partials` (reusable chunks). They must be stored in the `.partials` directory under the template directory. [Read more about partials](#partials).
1. Templates may contain multiple files. Unless stated otherwise, all files will be rendered.
1. The default variables you have access to in any the template file are the following:
   - `asyncapi` that is a parsed spec file object. Read the [API](https://github.com/asyncapi/parser-api/blob/master/docs/api.md#asyncapidocument) of the Parser to understand what structure you have access to in this parameter.
   - `originalAsyncAPI` that is an original spec file before it is parsed. 
   - `params` that contain the parameters provided when generating.

### Partials

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

### Filters

A filter is a helper function that you can create to perform complex tasks. They are JavaScript files that register one or many [Nunjuck filters](https://mozilla.github.io/nunjucks/api.html#custom-filters). The generator parses all the files in the `filters` directory. Functions exported from these files are registered as filters.

You can use the filter function in your template as in the following example:

```js
const {{ channelName | camelCase }} = '{{ channelName }}';
```

The generator also supports asynchronous filters. Asynchronous filters receive as the last argument a callback to resume rendering. Asynchronous filters must be annotated with the `async` keyword. Make sure to call the callback with two arguments: `callback(err, res)`. `err` can be `null`. See the following example of how to use asynchronous filters:

```js
const filter = module.exports;

async function asyncCamelCase(str, callback) {
  try {
    const result = // logic for camel casing str
    callback(null, result);
  } catch (error) {
    callback(error);
  }
}
filter.renderAsyncContent = renderAsyncContent;

// using in template
{{ channelName | asyncCamelCase }}
```

Unfortunately, if you need to use Promise, filter still must be annotated with the `async` keyword:

```js
async function asyncCamelCase(str, callback) {
  return new Promise((resolve, reject) => {
    // logic with callback
  });
}
```

In case you have more than one template and want to reuse filters, you can put them in a single library. You can configure such a library in the template configuration under `filters` property. To learn how to add such filters to configuration, [read more about the configuration file](configuration-file).


You can also use the official AsyncAPI [nunjucks-filters](https://github.com/asyncapi/generator/tree/master/apps/nunjucks-filters) which is included by default in the generator library.

> **Note:**  The nunjucks-filters is deprecated, and you should migrate to react-renderer instead. For more details, read notes from release [@asyncapi/generator@2.6.0](https://github.com/asyncapi/generator/releases/tag/%40asyncapi%2Fgenerator%402.6.0).
