---
title: "Usage"
weight: 30
---

There are two ways to use the generator:
- [Generator CLI](#generator-cli)
- [Generator library](#using-as-a-modulepackage)

## Generator CLI
```bash
Usage: asyncapi generate fromTemplate <asyncapi> <template> [<options>]

- <asyncapi>: Local path or URL pointing to AsyncAPI document for example https://bit.ly/asyncapi
- <template>: Name of the generator template like for example @asyncapi/html-template or https://github.com/asyncapi/html-template

- <options>:
  -V, --version                  output the generator version
  -d, --disable-hook [hooks...]  disable a specific hook type or hooks from a given hook type
  --debug                        enable more specific errors in the console
  -i, --install                  install the template and its dependencies (defaults to false)
  -n, --no-overwrite <glob>      glob or path of the file(s) to skip when regenerating
  -o, --output <outputDir>       directory to put the generated files (defaults to current directory)
  -p, --param <name=value>       additional parameters to pass to templates
  --force-write                  force writing of the generated files to a given directory even if it is a Git repository with unstaged files or not empty dir (defaults to false)
  --watch-template               watches the template directory and the AsyncAPI document, and re-generates the files when changes occur. Ignores the output directory. This flag should be used only for template development.
  --map-base-url <url:folder>    maps all schema references from base URL to local folder
  -h, --help                     display help for command
```

All templates are installable npm packages. Therefore, the value of `template` can be anything supported by `npm install`. Here's a summary of the possibilities:
```
npm install [<@scope>/]<name>
npm install [<@scope>/]<name>@<tag>
npm install [<@scope>/]<name>@<version>
npm install [<@scope>/]<name>@<version range>
npm install <git-host>:<git-user>/<repo-name>
npm install <git repo url>
npm install <tarball file>
npm install <tarball url>
npm install <folder>
```

### Global templates installed with `yarn` or `npm`

You can preinstall templates globally before installing the generator CLI. The generator first tries to locate the template in local dependencies; if absent it checks where the global generator packages are installed.

```bash
npm install -g @asyncapi/html-template@0.16.0
asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template
# The generator uses html-template version 0.16.0 and not the latest version.
```

### CLI usage examples

**The shortest possible syntax:**
```bash
asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template
```

**Generating from a URL:**
```bash
asyncapi generate fromTemplate https://bit.ly/asyncapi @asyncapi/html-template
```

**Specify where to put the result:**
```bash
asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template -o ./docs
```

**Passing parameters to templates:**
```bash
asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template -o ./docs -p title='Hello from param'
```

In the template you can use it like this: ` {{ params.title }}`

**Disabling the hooks:**
```bash
asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template -o ./docs -d generate:before generate:after=foo,bar
```

The generator skips all hooks of the `generate:before` type and `foo`, `bar` hooks of the `generate:after` type.

**Installing the template from a folder:**
```bash
asyncapi generate fromTemplate asyncapi.yaml ~/my-template
```

It creates a symbolic link to the target directory (`~/my-template` in this case). 

**Installing the template from a git URL:**
```bash
asyncapi generate fromTemplate asyncapi.yaml https://github.com/asyncapi/html-template.git
```

**Map schema references from baseUrl to local folder:**
```bash
asyncapi generate fromTemplate test/docs/apiwithref.json @asyncapi/html-template -o ./build/ --force-write --map-base-url https://schema.example.com/crm/:./test/docs/
```

The parameter `--map-base-url` maps external schema references to local folders.

### CLI usage with Docker

When using our docker image that we regularly update, you don't need to install Node.js or Npm, even though the generator is written with it since the Docker image has the generator installed.

Install [Docker](https://docs.docker.com/get-docker/) first, then use docker to pull and run the image using the following command:

```bash
docker run --rm -it \
-v [ASYNCAPI SPEC FILE LOCATION]:/app/asyncapi.yml \
-v [GENERATED FILES LOCATION]:/app/output \
asyncapi/generator [COMMAND HERE]

# Example that you can run inside the generator directory after cloning this repository. First, you specify the mount in the location of your AsyncAPI specification file and then you mount it in the directory where the generation result should be saved.
docker run --rm -it \
-v ${PWD}/test/docs/dummy.yml:/app/asyncapi.yml \
-v ${PWD}/output:/app/output \
asyncapi/generator -o /app/output /app/asyncapi.yml @asyncapi/html-template --force-write
```

### CLI usage with `npx` instead of `npm`

[npx](https://www.npmjs.com/package/npx) is very useful when you want to run the generator in a CI/CD environment. In such a scenario, do not install the generator globally because most environments that provide Node.js and Npm, also provide npx out of the box. 

Use the following npx command on your terminal:

```bash
npx -p @asyncapi/cli asyncapi generate fromTemplate ./asyncapi.yaml @asyncapi/html-template
```

## Using as a module/package
Once you install the generator in your project, you can use it to generate whatever you want. The following code snippet is an example of HTML generation using the official `@asyncapi/html-template` template and fetching the spec document from the server using:
```
https://raw.githubusercontent.com/asyncapi/asyncapi/2.0.0/examples/2.0.0/streetlights.yml
```

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

See the [API documentation](api.md) for more examples and full API reference information.