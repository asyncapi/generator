### Filters

A filter is a helper function that you can create to perform complex tasks. They are JavaScript files that register one or many Nunjuck filters. The generator parses all the files in the filters directory. Functions exported from these files are registered as filters.

You can use the filter function in your template as in the following example:

```js
const {{ channelName | camelCase }} = '{{ channelName }}';
```

The generator also supports asynchronous filters. Asynchronous filters receive as last argument a callback to resume rendering. Asynchronous filters must be annotated with the async keyword. Make sure to call the callback with two arguments: callback(err, res). err can be null. See the following example of how to use asynchronous filters:

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