---
title: "Template"
weight: 40
---

# What's a Template?

A Template is a project that specifies what exactly you get as an output of the generation process using AsyncAPI Generator and the [AsyncAPI file](asyncapi-file.md). It is just a set of files where you describe what should be the result of the generation depending on the contents of the AsyncAPI file. Some examples of these outputs can be things such as: code, documentation, diagrams, python and java applications, and much more. 

A template is an independent NodeJS project that’s not related to the `generator` repository. AsyncAPI templates are managed, released, and published separately. You can also create your own templates and manage them on your own.

The generator uses the official NPM library for installing NodeJS dependencies called [Arborist](https://www.npmjs.com/package/@npmcli/arborist). This means templates do not have to be published to package managers to use them, just make sure they have `package.json`.

Arborist helps the generator fetch the source code of the template and use that for the generation process. You can store template projects on a local drive during the development process, or just as a git repository. You can do anything that is already possible with `npm install`.

The following section talks about the bare minimum components your template should have in any given situation:

# Minimum for your template

The most basic template must have the following:

### 1. `template` directory

This is where you keep the files that determine the output that will be generated. In other words, the Generator processes all the files stored in this directory.

```js
import { File, Text } from "@asyncapi/generator-react-sdk";

export default function({ asyncapi, params, originalAsyncAPI }) {
return (
    <File name="asyncapi.md">
    <Text>This is a markdown file for my application.</Text>
    <Text>App name is: **{ asyncapi.info().title() }**</Text>
    </File>
);
}
```

The above example of `template/index.js` file shows as a result of the generation process. A user of such a minimal template will receive `asyncapi.md` file with some hardcoded information and some dynamic information extracted for the AsyncAPI file.

Important to notice is that every template must depend on [`@asyncapi/generator-react-sdk`](https://github.com/asyncapi/generator-react-sdk) package containing a set of basic components to use in template files.

### 2. `package.json` file

Before the generation process runs, the Generator must install the template into its dependencies, and `package.json` is necessary to identify the template name.

Following block shows an example `package.json` file and some select dependencies:

```json
{
  "name": "myTemplate",
  "generator": {
    "renderer": "react"
  },
  "dependencies": {
    "@asyncapi/generator-react-sdk": "^0.2.25"
  }
}
```

> Whenever you make a change to package.json make sure you perform an update with `npm install` to synchronize with package-lock.json and validate if the file is not broken after your changes.

Templates are reusable. Same template can be modified and used for different purposes. [Hooks](hooks.md) enable templates to perform multiple tasks. Hooks are fractions of code that can be added to your Template. They can be plugged-in onto the generation process to perform multiple actions. For example, we can configure a hook that generates a pdf after the generation process is completed.

Similarly, you can have your Template perform multiple actions before or after the generation process with the help of Hooks.

Render engines are actually responsible for generating–code, documentation, markdown, diagrams, or anything else you may have specified to be generated as output. AsyncAPI templates support multiple render engines including both [Nunjucks](nunjucks-render-engine.md) and [React](react-render-engine.md). 

Each rendering engine has its own process and unique set of features. Hence, your choice of render engine greatly affects how you write a Template. Even though you are free to use the render engine of your choice, AsyncAPI recommends you to use React render engine for your projects.

> AsyncAPI [React SDK](https://github.com/asyncapi/generator-react-sdk) is a set of components/functions to use React as render engine in the Generator.

The diagram below shows how Template functions in accordance with generator to produce an output in whatever format you want:

> This section is under construction





