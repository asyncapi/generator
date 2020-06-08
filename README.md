<h1 align="center">AsyncAPI Generator</h1>
<p align="center">
  <em>Use your AsyncAPI definition to generate literally anything. Markdown documentation, Node.js code, HTML documentation, anything!</em>
</p>

![npm](https://img.shields.io/npm/v/@asyncapi/generator?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@asyncapi/generator?style=for-the-badge)

<br><br>

> :warning: This package doesn't support AsyncAPI 1.x anymore. We recommend to upgrade to the latest AsyncAPI version using the [AsyncAPI converter](https://github.com/asyncapi/converter-js). If you need to convert documents on the fly, you may use the [Node.js](https://github.com/asyncapi/converter-js) or [Go](https://github.com/asyncapi/converter-go) converters.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Overview](#overview)
- [List of official generator templates](#list-of-official-generator-templates)
- [Requirements](#requirements)
- [Using from the command-line interface (CLI)](#using-from-the-command-line-interface-cli)
  * [Install the CLI](#install-the-cli)
  * [Update the CLI](#update-the-cli)
  * [CLI usage](#cli-usage)
  * [CLI usage examples](#cli-usage-examples)
  * [CLI usage with Docker](#cli-usage-with-docker)
  * [CLI usage with npx instead of npm](#cli-usage-with-npx-instead-of-npm)
- [Using as a module/package](#using-as-a-modulepackage)
  * [Install the module](#install-the-module)
  * [Example using the module](#example-using-the-module)
- [Generator version vs Template version](#generator-version-vs-template-version)
- [How to create a template](#how-to-create-a-template)
- [Contributing](#contributing)
- [Contributors ✨](#contributors-%E2%9C%A8)

<!-- tocstop -->

## Overview

Generator is a tool that you can use to generate whatever you want basing on the AsyncAPI specification file as an input.

To specify what exactly must be generated you create so called **template**. To create your own template, go to section that explains [How to create a template](#how-to-create-a-template).

There is a large number of templates that are ready to use and are officially supported by the AsyncAPI Initiative.

## List of official generator templates

<!-- templates list is validated with GitHub Actions do not remove list markers -->
<!-- TEMPLATES-LIST:START -->

Template Name | Description | Source code
---|---|---
`@asyncapi/nodejs-template` | Generates Nodejs service that uses Hermes package | [click here](https://github.com/asyncapi/nodejs-template)
`@asyncapi/nodejs-ws-template` | Generates Nodejs service that supports WebSockets protocol only | [click here](https://github.com/asyncapi/nodejs-ws-template)
`@asyncapi/java-spring-template` | Generates Java Spring service | [click here](https://github.com/asyncapi/java-spring-template)
`@asyncapi/java-spring-cloud-stream-template` | Generates Java Spring Cloud Stream service | [click here](https://github.com/asyncapi/java-spring-cloud-stream-template)
`@asyncapi/python-paho-template` | Generates Python service that uses Paho library | [click here](https://github.com/asyncapi/python-paho-template)
`@asyncapi/html-template` | Generates HTML documentation site | [click here](https://github.com/asyncapi/markdown-template)
`@asyncapi/markdown-template` | Generates documentation in Markdown file | [click here](https://github.com/asyncapi/html-template)

<!-- TEMPLATES-LIST:END -->

You can find above templates and the ones provided by the community in **[this list](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate)**

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

### Update the CLI

You might want to update your local installation of generator for different reasons:

* You want the latest generator to have its latest features. Perform usual installation and in case you had generator installed already, it will upgrade to latest available:
    ```bash
    npm install -g @asyncapi/generator
    ```
* You want a specific version of the generator because your template might not be compatible with the latest generator. Check [what version you need](https://github.com/asyncapi/generator/releases) and perform installation, specifying the exact version with the `@` character:
    ```bash
    npm install -g @asyncapi/generator@0.50.0
    ```

> Sometimes you have to force additional npm installation like this: `npm install -g --force @asyncapi/generator`

### CLI usage

```bash
Usage: cli [options] <asyncapi> <template>

- <asyncapi>: Local path or URL pointing to AsyncAPI specification file
- <template>: Name of the generator template like for example @asyncapi/html-template or https://github.com/asyncapi/html-template

Options:
  -V, --version                  output the version number
  -d, --disable-hook <hookType>  disable a specific hook type
  --debug                        enable more specific errors in the console.
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

### CLI usage examples

**The shortest possible syntax:**
```bash
ag asyncapi.yaml @asyncapi/html-template
```

**Generating from a URL:**
```bash
ag https://bit.ly/asyncapi @asyncapi/html-template
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

### CLI usage with Docker

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

### CLI usage with npx instead of npm

The [npx](https://www.npmjs.com/package/npx) is very useful when you want to run Generator in CI/CD environment. In such a scenario, you do not want to install generator globally and most environments that provide Node.js and npm, also provide npx out of the box.

```bash
npx -p @asyncapi/generator ag ./asyncapi.yaml @asyncapi/html-template
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

## Generator version vs Template version

The Generator is a tool that you can use to generate whatever you want, taking an AsyncAPI specification file as the input. A template is a tool that uses Generator features and helpers to specify what should be generated.

In other words, a template depends on the Generator and its features. For example, it might work with the latest version of the Generator but not the previous ones. 

The owner of the template specifies in the configuration what version of the Generator it is compatible with:
```bash
"generator": ">=0.50.0 <2.0.0",
```

The Generator doesn't work in case the template is not compatible:
```bash
Something went wrong:
Error: This template is not compatible with the current version of the generator (0.50.0). This template is compatible with the following version range: >=0.60.0 <2.0.0.
    at Generator.validateTemplateConfig (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:678:13)
    at Generator.loadTemplateConfig (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:663:16)
    at Generator.generate (/Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/lib/generator.js:146:18)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at async /Users/wookiee/.nvm/versions/node/v12.16.1/lib/node_modules/@asyncapi/generator/cli.js:135:7
```

In case you use Generator CLI and a specific template on production, it is safer to lock to a specific version of the template and the Generator. 

Instead of generating HTML with latest `html-template` and the generator CLI:
```bash
npm install -g @asyncapi/generator
ag asyncapi.yaml @asyncapi/html-template -o ./docs
```

Generate HTML with the version of the `html-template` and the Generator CLI that you are happy with:
```bash
npm install -g @asyncapi/generator@0.50.0
ag asyncapi.yaml @asyncapi/html-template@0.7.0 -o ./docs
```

Before using newer versions of the template, always look at the [changelog](https://github.com/asyncapi/html-template/releases) first. Generator features are not important for you, just make sure to use a version compatible with the template.

## How to create a template

To create your own template, for example code generator for some specific language and technology, read [authoring templates](docs/authoring.md) and the [list of templates recipes](docs/templates-recipes.md).

## Contributing

Read [CONTRIBUTING](CONTRIBUTING.md) guide.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.fmvilas.com"><img src="https://avatars3.githubusercontent.com/u/242119?v=4" width="100px;" alt=""/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="#question-fmvilas" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3Afmvilas" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=fmvilas" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=fmvilas" title="Documentation">📖</a> <a href="#ideas-fmvilas" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-fmvilas" title="Maintenance">🚧</a> <a href="#plugin-fmvilas" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=fmvilas" title="Tests">⚠️</a> <a href="#tutorial-fmvilas" title="Tutorials">✅</a></td>
    <td align="center"><a href="https://github.com/jonaslagoni"><img src="https://avatars1.githubusercontent.com/u/13396189?v=4" width="100px;" alt=""/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="#question-jonaslagoni" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3Ajonaslagoni" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=jonaslagoni" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#plugin-jonaslagoni" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3Ajonaslagoni" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=jonaslagoni" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://resume.github.io/?derberg"><img src="https://avatars1.githubusercontent.com/u/6995927?v=4" width="100px;" alt=""/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="#question-derberg" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3Aderberg" title="Bug reports">🐛</a> <a href="#blog-derberg" title="Blogposts">📝</a> <a href="https://github.com/asyncapi/generator/commits?author=derberg" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=derberg" title="Documentation">📖</a> <a href="#ideas-derberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-derberg" title="Maintenance">🚧</a> <a href="#plugin-derberg" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=derberg" title="Tests">⚠️</a> <a href="#tutorial-derberg" title="Tutorials">✅</a> <a href="#infra-derberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://twitter.com/treeder"><img src="https://avatars3.githubusercontent.com/u/75826?v=4" width="100px;" alt=""/><br /><sub><b>Travis Reeder</b></sub></a><br /><a href="#infra-treeder" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/generator/commits?author=treeder" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Tenischev"><img src="https://avatars1.githubusercontent.com/u/4137916?v=4" width="100px;" alt=""/><br /><sub><b>Semen</b></sub></a><br /><a href="https://github.com/asyncapi/generator/issues?q=author%3ATenischev" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=Tenischev" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=Tenischev" title="Documentation">📖</a> <a href="#ideas-Tenischev" title="Ideas, Planning, & Feedback">🤔</a> <a href="#plugin-Tenischev" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3ATenischev" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=Tenischev" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://waleedashraf.me/"><img src="https://avatars0.githubusercontent.com/u/8335457?v=4" width="100px;" alt=""/><br /><sub><b>Waleed Ashraf</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=WaleedAshraf" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3AWaleedAshraf" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/sebastian-palma"><img src="https://avatars2.githubusercontent.com/u/11888191?v=4" width="100px;" alt=""/><br /><sub><b>Sebastián</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=sebastian-palma" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
