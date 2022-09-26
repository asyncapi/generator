title: "Usage"
weight: 20
---

There are two ways you can use the Generator. Find your preferred method below:
- [Generator CLI](#generator-in-cli)
- [Generator library](#generator-library)

## Generator CLI
```bash
Usage: ag [options] <asyncapi> <template>

- <asyncapi>: Local path or URL pointing to AsyncAPI specification file
- <template>: Name of the generator template like for example @asyncapi/html-template or https://github.com/asyncapi/html-template

Options:
  -V, --version                  output the version number
  -d, --disable-hook [hooks...]  disable a specific hook type or hooks from given hook type
  --debug                        enable more specific errors in the console
  -i, --install                  installs the template and its dependencies (defaults to false)
  -n, --no-overwrite <glob>      glob or path of the file(s) to skip when regenerating
  -o, --output <outputDir>       directory where to put the generated files (defaults to current directory)
  -p, --param <name=value>       additional param to pass to templates
  --force-write                  force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir (defaults to false)
  --watch-template               watches the template directory and the AsyncAPI document, and re-generate the files when changes occur. Ignores the output directory. This flag should be used only for template development.
  --map-base-url <url:folder>    maps all schema references from base url to local folder
  -h, --help                     display help for command
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

### Global templates installed with yarn or npm

You can preinstall templates globally. The generator first tries to locate template in local dependencies and then in location where global packages are installed.

```bash
npm install -g @asyncapi/html-template@0.16.0
ag asyncapi.yaml @asyncapi/html-template
# The generator uses template in version 0.16.0 and not latest
```

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

**Disabling the hooks:**
```bash
ag asyncapi.yaml @asyncapi/html-template -o ./docs -d generate:before generate:after=foo,bar
```

The generator skips all hooks of the `generate:before` type and `foo`, `bar` hooks of the `generate:after` type.

**Installing the template from a folder:**
```bash
ag asyncapi.yaml ~/my-template
```

It creates a symbolic link to the target directory (`~/my-template` in this case).

**Installing the template from a git URL:**
```bash
ag asyncapi.yaml https://github.com/asyncapi/html-template.git
```

**Map schema references from baseUrl to local folder:**
```bash
ag test/docs/apiwithref.json @asyncapi/html-template -o ./build/ --force-write --map-base-url https://schema.example.com/crm/:./test/docs/
```

The parameter `--map-base-url` maps external schema references to local folders.

### CLI usage with Docker

Install [Docker](https://docs.docker.com/get-docker/) first. Thanks to Docker you do not need Node.js even though the generator is written with it.

```bash
docker run --rm -it \
-v [ASYNCAPI SPEC FILE LOCATION]:/app/asyncapi.yml \
-v [GENERATED FILES LOCATION]:/app/output \
asyncapi/generator [COMMAND HERE]

# Example that you can run inside generator directory after cloning this repository. First you specify mount in location of your AsyncAPI specification file and then you mount in directory where generation result should be saved.
docker run --rm -it \
-v ${PWD}/test/docs/dummy.yml:/app/asyncapi.yml \
-v ${PWD}/output:/app/output \
asyncapi/generator -o /app/output /app/asyncapi.yml @asyncapi/html-template --force-write
```

### CLI usage with npx instead of npm

The [npx](https://www.npmjs.com/package/npx) is very useful when you want to run Generator in CI/CD environment. In such a scenario, you do not want to install generator globally and most environments that provide Node.js and npm, also provide npx out of the box.

```bash
npx -p @asyncapi/generator ag ./asyncapi.yaml @asyncapi/html-template
```

## Generator library

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