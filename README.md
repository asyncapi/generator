<h1 align="center">AsyncAPI Generator</h1>
<p align="center">
  <em>Use your AsyncAPI definition to generate literally anything. Markdown documentation, Node.js code, HTML documentation, anything!</em>
</p>

![npm](https://img.shields.io/npm/v/asyncapi-generator?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/asyncapi-generator?style=for-the-badge)

<br><br>

> :warning: This package doesn't support AsyncAPI 1.x anymore. We recommend to upgrade to the latest AsyncAPI version using the [AsyncAPI converter](https://github.com/asyncapi/converter). If you need to convert documents on the fly, you may use the [Node.js](https://github.com/asyncapi/converter) or [Go](https://github.com/asyncapi/converter-go) converters.

## Install

```bash
npm install -g asyncapi-generator
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
  Usage: ag [options] <asyncapi> <template>


  Options:

    -V, --version                  output the version number
    -w, --watch                    watches the templates directory and the AsyncAPI document for changes, and re-generate the files when they occur
    -o, --output <outputDir>       directory where to put the generated files (defaults to current directory)
    -d, --disable-hook <hookName>  disable a specific hook
    -n, --no-overwrite <glob>      glob or path of the file(s) to skip when regenerating
    -p, --param <name=value>       additional param to pass to templates
    -t, --templates <templateDir>  directory where templates are located (defaults to internal templates directory)
    --force-install                forces the installation of the template dependencies. By default, dependencies are installed and this flag is taken into account only if `node_modules` is not in place.
    -h, --help                     output usage information
    --force-write                  force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir (defaults to false)
```

Please check out the **templates** directory to get a list of the supported languages/formats.

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

See [API documentation](docs/api.md).

### Authoring templates

See [authoring templates](docs/authoring.md) and the [list of templates recipes](docs/templates-recipes.md).

## Requirements

* Node.js v8.5+

## Contributing

Contributions are more than welcome. If you want to contribute, please make sure you go through the following steps:

1. Pick or create an issue. It's always a good idea to leave a message saying that you're going to work on it before you start any actual work.
2. Fork the repository and work there.
3. Open a Pull Request pointing to the `master` branch.
4. A maintainer will review and, eventually, merge your Pull Request. Please, be patient as most of us are doing this in our spare time.

## Author

Fran Méndez ([@fmvilas](http://twitter.com/fmvilas))
