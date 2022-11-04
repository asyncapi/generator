---
title: "Template"
weight: 40
---

# Introduction

A template is a project that specifies the generation process output by using the AsyncAPI generator and an [AsyncAPI file](asyncapi-file.md). These files describe the generation results depending on the AsyncAPI file's content.

Some examples outputs are:

- Code
- Documentation
- Markdown diagrams
- Python/Java applications

A template is an independent NodeJS project unrelated to the `generator` repository. AsyncAPI templates are managed, released, and published separately. You can also create templates and manage them on your own.

The generator uses the official NPM library for installing NodeJS dependencies called [Arborist](https://www.npmjs.com/package/@npmcli/arborist). (This means templates do not have to be published to package managers to use them.) Arborist helps the generator fetch the template's source code and use it for the generation process. 

You can store template projects on a local drive or as a `git` repository during the development process. 

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

> Some of these templates are maintained by various third-party organizations. The readME file usually contains this information and more, such as configuration options that the user can pass to the template, usage, technical requirements, etc.

Check out all of our [templates and those provided by the community](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate)

