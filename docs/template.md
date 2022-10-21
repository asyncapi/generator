---
title: "Template"
weight: 40
---

# Introduction

A template is a project that specifies the generation process output by using the AsyncAPI Generator and an [AsyncAPI file](asyncapi-file.md). These files describe the generation results depending on the AsyncAPI file's content.

Some examples outputs are:

- Code
- Documentation
- Markdown diagrams
- Python/Java applications

A template is an independent NodeJS project that’s not related to the `Generator` repository. AsyncAPI templates are managed, released, and published separately. You can also create your own templates and manage them on your own.

The generator uses the official NPM library for installing NodeJS dependencies called [Arborist](https://www.npmjs.com/package/@npmcli/arborist). (This means templates do not have to be published to package managers to use them.) Arborist helps the Generator fetch the template's source code and use it for the generation process. 

You can store template projects on a local drive during the development process or as a git repository. 

## Official generator `templates` list

AsyncAPI has a list of available templates you can use to enhance your generation process. These templates are stored as GitHub repositories on the AsyncAPI organization’s official GitHub profile.

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


