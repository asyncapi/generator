<h1 align="center">AsyncAPI Generator</h1>
<p align="center">
  <em>Use your AsyncAPI definition to generate literally anything. Markdown documentation, Node.js code, HTML documentation, anything!</em>
</p>

![npm](https://img.shields.io/npm/v/@asyncapi/generator?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@asyncapi/generator?style=for-the-badge)

<br><br>

> :warning: This package doesn't support AsyncAPI 1.x anymore. We recommend to upgrade to the latest AsyncAPI version using the [AsyncAPI converter](https://github.com/asyncapi/converter-js). If you need to convert documents on the fly, you may use the [Node.js](https://github.com/asyncapi/converter-js) or [Go](https://github.com/asyncapi/converter-go) converters.

<!-- TOC -->

- [Overview](#overview)
- [List of official generator templates](#list-of-official-generator-templates)
- [Requirements](#requirements)
- [Using from the command-line interface (CLI)](#using-from-the-command-line-interface-cli)
    - [Install the CLI](#install-the-cli)
    - [Options](#options)
    - [Examples using the CLI](#examples-using-the-cli)
    - [You don't like technical requirements for the CLI?](#you-dont-like-technical-requirements-for-the-cli)
        - [Run with npx](#run-with-npx)
        - [Run with Docker](#run-with-docker)
- [Using as a module/package](#using-as-a-modulepackage)
    - [Install the module](#install-the-module)
    - [Example using the module](#example-using-the-module)
- [How to create a template](#how-to-create-a-template)
- [Contributing](#contributing)

<!-- /TOC -->


## Overview

Generator is a tool that you can use to generate whatever you want basing on the AsyncAPI specification file as an input.

To specify what exactly must be generated you create so called **template**. To create your own template, go to section that explains [How to create a template](#how-to-create-a-template).

There is a large number of templates that are ready to use and are officially supported by the AsyncAPI Initiative.

## List of official generator templates

Template Name | Description | Source code
---|---|---
`@asyncapi/nodejs-template` | Generates Nodejs service that uses Hermes package | [click here](https://github.com/asyncapi/nodejs-template)
`@asyncapi/nodejs-ws-template` | Generates Nodejs service that supports WebSockets protocol only | [click here](https://github.com/asyncapi/nodejs-ws-template)
`@asyncapi/java-spring-template` | Generates Java Spring service | [click here](https://github.com/asyncapi/java-spring-template)
`@asyncapi/java-spring-cloud-stream-template` | Generates Java Spring Cloud Stream service | [click here](https://github.com/asyncapi/java-spring-cloud-stream-template)
`@asyncapi/python-paho-template` | Generates Python service that uses Paho library | [click here](https://github.com/asyncapi/python-paho-template)
`@asyncapi/html-template` | Generates HTML documentation site | [click here](https://github.com/asyncapi/markdown-template)
`@asyncapi/markdown-template` | Generates documentation in Markdown file | [click here](https://github.com/asyncapi/html-template)

You can find source code of these templates **[Click here!](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate)**

## Requirements

* Node.js v12.16+
* npm v6.13.7+

Install both packages using [official installer](https://nodejs.org/en/download/). After installation make sure both packages have proper version by running `node -v` and `npm -v`. To upgrade invalid npm version run `npm install npm@latest -g`

## Using from the command-line interface (CLI)

### Install the CLI

To use it as CLI, install generator globally:

```bash
npm install -g @asyncapi/generator
```

### Options

```bash
Usage: cli [options] <asyncapi> <template>

- <asyncapi>: Local path or URL pointing to AsyncAPI specification file
- <template>: Name of the generator template like for example @asyncapi/html-template or https://github.com/asyncapi/html-template

Options:
  -V, --version                  output the version number
  -d, --disable-hook <hookType>  disable a specific hook type
  --debug                        enable more specific errors in the console. At the moment it only shows specific errors about filters. Keep in mind that as a result errors about template are less descriptive
  -i, --install                  installs the template and its dependencies (defaults to false)
  -n, --no-overwrite <glob>      glob or path of the file(s) to skip when regenerating
  -o, --output <outputDir>       directory where to put the generated files (defaults to current directory)
  -p, --param <name=value>       additional param to pass to templates
  --force-write                  force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir (defaults to false)
  --watch-template               watches the template directory and the AsyncAPI specification file, and re-generate the files when changes occur. Ignores the output directory. This flag should be used only for template development.
  -h, --help                     output usage information
```

<details>
  <summary>Click here to read more about supported values for the <code>&lt;template&gt;</code> parameter.</summary>
  <br>
  Templates are installable npm packages. Therefore, the value of <code>&lt;template&gt;</code> can be anything supported by <code>npm install</code>. Here's a summary of the possibilities:
  <br><br>
  <pre><code>
  npm install [&lt;@scope&gt;/]&lt;name&gt;
  npm install [&lt;@scope&gt;/]&lt;name&gt;@&lt;tag&gt;
  npm install [&lt;@scope&gt;/]&lt;name&gt;@&lt;version&gt;
  npm install [&lt;@scope&gt;/]&lt;name&gt;@&lt;version range&gt;
  npm install &lt;git-host&gt;:&lt;git-user&gt;/&lt;repo-name&gt;
  npm install &lt;git repo url&gt;
  npm install &lt;tarball file&gt;
  npm install &lt;tarball url&gt;
  npm install &lt;folder&gt;</code></pre>
</details>
<br>

### Examples using the CLI

**The shortest possible syntax:**
```bash
ag asyncapi.yaml @asyncapi/html-template
```

**Generating from a URL:**
```bash
ag https://raw.githubusercontent.com/asyncapi/asyncapi/2.0.0/examples/2.0.0/streetlights.yml @asyncapi/html-template
```

**Specify where to put the result:**
```bash
ag asyncapi.yaml @asyncapi/html-template -o ./docs
```

**Passing parameters to templates:**
```bash
ag asyncapi.yaml @asyncapi/html-template -o ./docs -p title='Hello from param'
```
In the template you can use it like this: ` {{ params.title }}`

**Installing the template from a folder:**
```bash
ag asyncapi.yaml ~/my-template
```

It creates a symbolic link to the target directory (`~/my-template` in this case).

**Installing the template from a git URL:**
```bash
ag asyncapi.yaml https://github.com/asyncapi/html-template.git
```

### You don't like technical requirements for the CLI?

#### Run with npx

The [npx](https://www.npmjs.com/package/npx) is very useful when you want to run generator in CI/CD environment. In such scenario you do not want to install generator globally and most environments that provide Node.js and npm, also provide npx out of the box.

```bash
npx -p @asyncapi/generator ag ./asyncapi.yaml @asyncapi/html-template
```

#### Run with Docker

Install [Docker](https://docs.docker.com/get-docker/) first. Thanks to Docker you do not need Node.js even though the generator is written with it.

```bash
docker run --rm -it \
-v [ASYNCAPI SPEC FILE LOCATION]:/app/asyncapi.yml \
-v [GENERATED FILES LOCATION]:/app/output \
asyncapi/generator [COMMAND HERE]
# Example that you can run inside generator directory after cloning this repository. First you specify mount in location of your AsyncAPI specification file and then you mount in directory where generation result should be saved.
docker run --rm -it \
-v ${PWD}/test/docs/streetlights.yml:/app/asyncapi.yml \
-v ${PWD}/output:/app/output \
asyncapi/generator -o ./output asyncapi.yml @asyncapi/html-template --force-write
```

## Using as a module/package

### Install the module

```bash
npm install @asyncapi/generator --save
```

### Example using the module 

Below you can find an example of HTML generation using official `@asyncapi/html-template` template and fetching the spec document from server like `https://raw.githubusercontent.com/asyncapi/asyncapi/2.0.0/examples/2.0.0/streetlights.yml` :

```js
const path = require('path');
const generator = new Generator('@asyncapi/html-template', path.resolve(__dirname, 'example'));

try {
  await generator.generateFromURL('https://raw.githubusercontent.com/asyncapi/asyncapi/2.0.0/examples/2.0.0/streetlights.yml');
  console.log('Done!');
} catch (e) {
  console.error(e);
}
```

See [API documentation](docs/api.md) for more example and full API reference information.

## How to create a template

To create your own template, for example code generator for some specific language and technology, read [authoring templates](docs/authoring.md) and the [list of templates recipes](docs/templates-recipes.md).

## Contributing

Read [CONTRIBUTING](CONTRIBUTING.md) guide.
