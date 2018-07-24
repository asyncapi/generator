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

## Requirements

* Node.js v7.6+

## Author

Fran Méndez ([@fmvilas](http://twitter.com/fmvilas))
