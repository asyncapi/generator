<h1 align="center">AsyncAPI Generator</h1>
<p align="center">
  <em>Use your AsyncAPI definition to generate literally anything. Markdown documentation, Node.js code, HTML documentation, anything!</em>
</p>
<br><br>

## Install

```bash
npm install -g asyncapi-generator
```

## Usage

### From the command-line interface (CLI)

```bash
  Usage: ag [options] <asyncapi> <template>


  Options:

    -V, --version                 output the version number
    -t, --templates <templateDir> directory where templates are located (defaults to internal templates directory)
    -h, --help                    output usage information
```

#### Examples

The shortest possible syntax:
```bash
ag asyncapi.yaml markdown
```

Specify where to put the result:
```bash
ag -o ./docs asyncapi.yaml markdown
```

### As a module

#### .generateTemplateFile(options) : String

Generates a file of a given template, and returns the result as a string.

##### Parameters

|Name|Type|Required|Description|
|----|----|--------|-----------|
|options|`object`|Yes|An object containing all the options.|
|options.templateDir|`string`|No|Directory where to find the templates. Defaults to internal templates directory.|
|options.template|`string`|Yes|Name of the template you want to use.|
|options.file|`string`|Yes|Path to the file you want to generate.|
|options.config|`object`|Yes|An object containing configuration options.|
|options.config.asyncapi|`string`&#124;`object`|Yes|Path to the AsyncAPI file to use.

##### Example

```js
const generator = require('asyncapi-generator');

generator.generateTemplateFile({
  template: 'html',
  file: 'index.html',
  config: {
    asyncapi: path.resolve(__dirname, 'asyncapi.yml'),
  }
})
  .then((result) => {
    // `result` is a string containing the generated file.
    console.log(result);
  })
  .catch(console.error);
```

#### .getTemplateFile(options) : String

Gets a file of a given template, and returns the its content as a string.

##### Parameters

|Name|Type|Required|Description|
|----|----|--------|-----------|
|options|`object`|Yes|An object containing all the options.|
|options.templateDir|`string`|No|Directory where to find the templates. Defaults to internal templates directory.|
|options.template|`string`|Yes|Name of the template you want to use.|
|options.file|`string`|Yes|Path to the file you want to generate.|

##### Example

```js
const generator = require('asyncapi-generator');

generator.getTemplateFile({
  template: 'html',
  file: 'css/main.css',
})
  .then((content) => {
    console.log(result);
  })
  .catch(console.error);
```

## Requirements

* Node.js v7.6+

## Author

Fran Méndez ([@fmvilas](http://twitter.com/fmvilas))
