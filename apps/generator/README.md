Generator is a tool that you can use to generate whatever you want basing on the AsyncAPI specification file as an input. For more information [read the docs](https://www.asyncapi.com/docs/tools/generator).

There is a large number of templates that are ready to use and are officially supported by the AsyncAPI Initiative.

## List of official generator templates

<!-- templates list is validated with GitHub Actions do not remove list markers -->
<!-- TEMPLATES-LIST:START -->

| Template Name                                 | Description                                                     | Source code                                                                 |
| --------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `@asyncapi/nodejs-template`                   | Generates Nodejs service that uses Hermes package               | [click here](https://github.com/asyncapi/nodejs-template)                   |
| `@asyncapi/nodejs-ws-template`                | Generates Nodejs service that supports WebSockets protocol only | [click here](https://github.com/asyncapi/nodejs-ws-template)                |
| `@asyncapi/java-template`                     | Generates Java JMS application                                  | [click here](https://github.com/asyncapi/java-template)                     |
| `@asyncapi/java-spring-template`              | Generates Java Spring service                                   | [click here](https://github.com/asyncapi/java-spring-template)              |
| `@asyncapi/java-spring-cloud-stream-template` | Generates Java Spring Cloud Stream service                      | [click here](https://github.com/asyncapi/java-spring-cloud-stream-template) |
| `@asyncapi/python-paho-template`              | Generates Python service that uses Paho library                 | [click here](https://github.com/asyncapi/python-paho-template)              |
| `@asyncapi/html-template`                     | Generates HTML documentation site                               | [click here](https://github.com/asyncapi/html-template)                     |
| `@asyncapi/markdown-template`                 | Generates documentation in Markdown file                        | [click here](https://github.com/asyncapi/markdown-template)                 |
| `@asyncapi/ts-nats-template`                  | Generates TypeScript NATS client                                | [click here](https://github.com/asyncapi/ts-nats-template/)                 |
| `@asyncapi/go-watermill-template`             | Generates Go client using Watermill                             | [click here](https://github.com/asyncapi/go-watermill-template)             |
| `@asyncapi/dotnet-nats-template`              | Generates .NET C# client using NATS                             | [click here](https://github.com/asyncapi/dotnet-nats-template)              |
| `@asyncapi/php-template`                      | Generates PHP client using RabbitMQ                             | [click here](https://github.com/asyncapi/php-template)                      |
| `@asyncapi/dotnet-rabbitmq-template`          | Generates .NET C# client using RabbitMQ                         | [click here](https://github.com/asyncapi/dotnet-rabbitmq-template)          |

<!-- TEMPLATES-LIST:END -->

You can find above templates and the ones provided by the community in **[this list](https://github.com/search?q=topic%3Aasyncapi+topic%3Agenerator+topic%3Atemplate)**

> [!NOTE]
>AsyncAPI Generator also comes with **baked-in templates** - official templates shipped directly inside the Generator (`@asyncapi/generator`). They cover code, docs, configs, and SDKs, and are maintained under [`../../packages/templates`](packages/templates) with a consistent, opinionated structure for reliability and ease of maintenance. These provide visibility into ongoing experimental work and offer a streamlined way to generate clients, documentation, and other artifacts.

⚠️ This feature is experimental and not recommended for production use.

For those who want to try them out or learn more, see the [Baked-in templates documentation](https://www.asyncapi.com/docs/tools/generator/baked-in-templates).
