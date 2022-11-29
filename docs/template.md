---
title: "Template"
weight: 40
---

## Template

A template is a project that specifies the generation process output by using the AsyncAPI generator and an [AsyncAPI document](asyncapi-file.md). These files describe the generation results depending on the AsyncAPI document's content.

Some examples outputs are:

- Code
- Documentation
- Markdown diagrams
- Python/Java applications

A template is an independent NodeJS project unrelated to the `generator` repository. AsyncAPI templates are managed, released, and published separately. You can also create templates and manage them on your own.

The generator uses the official NPM library for installing NodeJS dependencies called [Arborist](https://www.npmjs.com/package/@npmcli/arborist). (This means templates do not have to be published to package managers to use them.) Arborist helps the generator fetch the template's source code and use it for the generation process. 

You can store template projects on a local drive or as a `git` repository during the development process. 

## Template generation process

1. Template is provided as a input to the **Generator**.
2. **asyncapi** is the original AsyncAPI document that is by default injected in your template file.
3. **params** are the parameters that you pass to the generator CLI. Later on, you can pass these **params** further to other components as well.
4. The generator passes both the original **asyncapi**, the original AsyncAPI document and the **params** to the **Template Context**.
5. Concurrently, the generator passes **Template files** to the **Render engine** as well. AsyncAPI uses two render engines—react and nunjucks.
6. Once the Render Engine receives both the Template Files and the Template Context, it injects all the dynamic values in your react or nunjucks based on the Template Files using the Template Context.
7. Finally, the render engine generates whatever output you may have specified in your template such as—code, documentation, diagrams, pdf, applications etc.

```mermaid
graph LR
    A[Template Context]
    B{Generator}
    D[Render Engine]
    F[Template] --> B
  subgraph Generator Library
    B --> | asyncapi | A
    B--> | params | A
    A --> D
    B --> | Template Files | D
  end
```

## Generator `templates` list

AsyncAPI has a list of available templates to enhance your generation process. Templates are stored as repositories on AsyncAPI's official GitHub profile.

<!-- templates list is validated with GitHub Actions do not remove list markers -->
<!-- TEMPLATES-LIST:START -->

Template Name | Description | Source code
---|---|---
`@asyncapi/nodejs-template` | Generates Nodejs service that uses Hermes package | [Nodejs template](https://github.com/asyncapi/nodejs-template)
`@asyncapi/nodejs-ws-template` | Generates Nodejs service that supports WebSockets protocol only | [Nodejs-websocket template](https://github.com/asyncapi/nodejs-ws-template)
`@asyncapi/java-template` | Generates Java JMS application | [Java template](https://github.com/asyncapi/java-template)
`@asyncapi/java-spring-template` | Generates Java Spring service | [Java spring template](https://github.com/asyncapi/java-spring-template)
`@asyncapi/java-spring-cloud-stream-template` | Generates Java Spring Cloud Stream service | [Java spring cloud stream template](https://github.com/asyncapi/java-spring-cloud-stream-template)
`@asyncapi/python-paho-template` | Generates Python service that uses Paho library | [Python paho template](https://github.com/asyncapi/python-paho-template)
`@asyncapi/html-template` | Generates HTML documentation site | [HTML template](https://github.com/asyncapi/html-template)
`@asyncapi/markdown-template` | Generates documentation in Markdown file | [Markdown template](https://github.com/asyncapi/markdown-template)
`@asyncapi/ts-nats-template` | Generates TypeScript NATS client | [TypeScript/Node.js NATS template](https://github.com/asyncapi/ts-nats-template/)
`@asyncapi/go-watermill-template` | Generates Go client using Watermill | [GO watermill template](https://github.com/asyncapi/go-watermill-template)
`@asyncapi/dotnet-nats-template` | Generates .NET C# client using NATS | [.NET C# NATS template](https://github.com/asyncapi/dotnet-nats-template)

<!-- TEMPLATES-LIST:END -->

> Some of these templates are maintained by various third-party organizations. The README file usually contains this information and more, such as configuration options that the user can pass to the template, usage, technical requirements, etc.

Check out all of our [templates and those provided by the community](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate)

