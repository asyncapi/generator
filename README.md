<h1 align="center">AsyncAPI Generator</h1>
<p align="center">
  <em>Use your AsyncAPI definition to generate literally anything. Markdown documentation, Node.js code, HTML documentation, anything!</em>
</p>

![npm](https://img.shields.io/npm/v/asyncapi-generator?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/asyncapi-generator?style=for-the-badge)

<br><br>

> :warning: This package doesn't support AsyncAPI 1.x anymore. We recommend to upgrade to the latest AsyncAPI version using the [AsyncAPI converter](https://github.com/asyncapi/converter). If you need to convert documents on the fly, you may use the [Node.js](https://github.com/asyncapi/converter) or [Go](https://github.com/asyncapi/converter-go) converters.

## Install

```bash
npm install -g @asyncapi/generator
```

Or just use Docker:

```bash
docker run --rm -it \
-v [ASYNCAPI FILE LOCATION]:/app/asyncapi.yml \
-v [GENERATED FILES LOCATION]:/app/output \
asyncapi/generator [COMMAND HERE]
# Example that you can run inside generator directory after cloning this repository. First you specify mount in location of your AsyncAPI file and then you mount in directory where generation result should be saved.
docker run --rm -it \
-v ${PWD}/test/docs/streetlights.yml:/app/asyncapi.yml \
-v ${PWD}/output:/app/output \
asyncapi/generator -o ./output asyncapi.yml markdown
```

## Usage

### From the command-line interface (CLI)

```bash
Usage: cli [options] <asyncapi> <template>

Options:
  -V, --version                  output the version number
  -d, --disable-hook <hookName>  disable a specific hook
  -i, --install                  installs the template and its dependencies (defaults to false)
  -n, --no-overwrite <glob>      glob or path of the file(s) to skip when regenerating
  -o, --output <outputDir>       directory where to put the generated files (defaults to current directory)
  -p, --param <name=value>       additional param to pass to templates
  --force-write                  force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir (defaults to false)
  --watch-template               watches the template directory and the AsyncAPI document, and re-generate the files when changes occur
  -h, --help                     output usage information
```

:mag: Do you want to find a template? **[Click here!](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate)**

#### Examples

The shortest possible syntax:
```bash
ag asyncapi.yaml @asyncapi/html-template
```

Specify where to put the result:
```bash
ag asyncapi.yaml @asyncapi/html-template -o ./docs
```

Passing parameters to templates:
```bash
ag asyncapi.yaml @asyncapi/html-template -o ./docs -p title='Hello from param'
```
In the template you can use it like this: ` {{ params.title }}`

### As a module

See [API documentation](docs/api.md).

### Authoring templates

See [authoring templates](docs/authoring.md) and the [list of templates recipes](docs/templates-recipes.md).

## Requirements

* Node.js v12.16+

## Contributing

Read [CONTRIBUTING](CONTRIBUTING.md) guide.

## Author

Fran Méndez ([@fmvilas](http://twitter.com/fmvilas))
