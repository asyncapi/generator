<h1 align="center">AsyncAPI Generator</h1>
<p align="center">
  <em>Use your AsyncAPI definition to generate literally anything. Markdown documentation, Node.js code, HTML documentation, anything!</em>
</p>
<br><br>

## Install

```bash
npm install -g asyncapi-generator
```

Or use all the commands below using Docker by prefixing them with:

```bash
docker run --rm -it -v $PWD:/app -w /app asyncapi/generator ag [COMMAND HERE]
```

## Usage

### From the command-line interface (CLI)

```bash
  Usage: ag [options] <asyncapi> <template>


  Options:

    -V, --version                  output the version number
    -o, --output <outputDir>       directory where to put the generated files (defaults to current directory)
    -t, --templates <templatesDir> directory where templates are located (defaults to internal templates directory)
    -p, --param <name=value>       additional param to pass to the template
    -h, --help                     output usage information
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

Passing parameters to templates:
```bash
ag -o ./docs --param title='Hello from param' asyncapi.yaml markdown
```
In the template you can use it like this: ` {{ params.title }}`


### As a module

See [API documentation](API.md).

### Authoring templates

See [Authoring templates](AUTHORING.md).

## Requirements

* Node.js v7.6+

## Contributing

Contributions are more than welcome. If you want to make a contribution, please make sure you go through the following steps:

1. Pick or create an issue. It's always a good idea to leave a message saying that you're going to work on it before you start any actual work.
2. Fork the repository and work there.
3. Open a Pull Request pointing to `master` branch.
4. A maintainer will review and, eventually, merge your Pull Request. Please, be patient as most of us are doing this in our spare time.

## Author

Fran Méndez ([@fmvilas](http://twitter.com/fmvilas))
