---
title: "Template"
weight: 40
---

# Introduction

A Template is a project that specifies what exactly you get as an output of the generation process using AsyncAPI Generator and the [AsyncAPI file](asyncapi-file.md). It is just a set of files where you describe what should be the result of the generation depending on the contents of the AsyncAPI file. 

Some examples of these outputs can be things such as:
- Code
- Documentation
- Markdown diagrams
- Python/Java applications

A template is an independent NodeJS project that’s not related to the `generator` repository. AsyncAPI templates are managed, released, and published separately. You can also create your own templates and manage them on your own.

The generator uses the official NPM library for installing NodeJS dependencies called [Arborist](https://www.npmjs.com/package/@npmcli/arborist). This means templates do not have to be published to package managers to use them.
Arborist helps the generator fetch the source code of the template and use that for the generation process. You can store template projects on a local drive during the development process, or just as a git repository. You can do anything that is already possible with `npm install`.

## List of official generator templates

AsyncAPI has a list of readily available templates you can use to enhance your generation process. These templates are stored as github repositories on AsyncAPI organization’s official github profile.

<!-- templates list is validated with GitHub Actions do not remove list markers -->
<!-- TEMPLATES-LIST:START -->

Template Name | Description | Source code
---|---|---
`@asyncapi/nodejs-template` | Generates Nodejs service that uses Hermes package | [click here](https://github.com/asyncapi/nodejs-template)
`@asyncapi/nodejs-ws-template` | Generates Nodejs service that supports WebSockets protocol only | [click here](https://github.com/asyncapi/nodejs-ws-template)
`@asyncapi/java-template` | Generates Java JMS application | [click here](https://github.com/asyncapi/java-template)
`@asyncapi/java-spring-template` | Generates Java Spring service | [click here](https://github.com/asyncapi/java-spring-template)
`@asyncapi/java-spring-cloud-stream-template` | Generates Java Spring Cloud Stream service | [click here](https://github.com/asyncapi/java-spring-cloud-stream-template)
`@asyncapi/python-paho-template` | Generates Python service that uses Paho library | [click here](https://github.com/asyncapi/python-paho-template)
`@asyncapi/html-template` | Generates HTML documentation site | [click here](https://github.com/asyncapi/html-template)
`@asyncapi/markdown-template` | Generates documentation in Markdown file | [click here](https://github.com/asyncapi/markdown-template)
`@asyncapi/ts-nats-template` | Generates TypeScript NATS client | [click here](https://github.com/asyncapi/ts-nats-template/)
`@asyncapi/go-watermill-template` | Generates Go client using Watermill | [click here](https://github.com/asyncapi/go-watermill-template)
`@asyncapi/dotnet-nats-template` | Generates .NET C# client using NATS | [click here](https://github.com/asyncapi/dotnet-nats-template)

<!-- TEMPLATES-LIST:END -->

> Some of these templates are maintained by various third party organizations. The readme file usually contains this information along with additional stuff such as–configuration options that user can pass to template, usage, technical requirements, and usage etc.

You can find above templates and the ones provided by the community in **[this list](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate)**


