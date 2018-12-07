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
    -o, --output <outputDir>      directory where to put the generated files (defaults to current directory)
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

## Contributing

Contributions are more than welcome. If you want to make a contribution, please make sure you go through the following steps:

1. Pick or create an issue. It's always a good idea to leave a message saying that you're going to work on it before you start any actual work.
2. Fork the repository and work there.
3. Open a Pull Request pointing to `develop` branch.
4. A maintainer will review and, eventually, merge your Pull Request. Please, be patient as most of us are doing this in our spare time.

If you're a maintainer, take it from here:

1. Merge Pull Request into `develop`.
2. Make sure your local `develop` and `master` branches are up to date.
3. Switch to `develop` branch.
4. Whenever you think it makes sense, make a release:
  - From develop branch, run: `git flow release start X.X.X`.
  - In release branch, update version in `package.json` and `package-lock.json`.
  - In release branch, run: `git flow release finish X.X.X`.
  - You should now be in `develop` branch. Run: `git push --tags && git checkout master && git push`.
5. Release to NPM should happen automatically. You can check status at https://travis-ci.org/asyncapi/asyncapi.

## Author

Fran Méndez ([@fmvilas](http://twitter.com/fmvilas))
