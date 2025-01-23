[![AsyncAPI Generator](./assets/readme-banner.png)](https://www.asyncapi.com/tools/generator)

> Some parts of the AsyncAPI Generator are deprecated and the plan is to remove them in October 2025. For more details read notes from release [@asyncapi/generator@2.6.0](https://github.com/asyncapi/generator/releases/tag/%40asyncapi%2Fgenerator%402.6.0).

This is a Monorepo managed using [Turborepo](https://turbo.build/) and contains the following package:

1. [Generator](apps/generator): This is a tool that you can use to generate whatever you want basing on the AsyncAPI specification file as an input.

1. [Hooks](apps/hooks): This library contains generator filters that can be reused across multiple templates, helping to avoid redundant work. Hooks are designed to let template developers hook into the template generation process. For example, one can create a hook code that will be automatically invoked right after the template generation process has ended.

1. [Nunjucks-filters](apps/nunjucks-filters): This library contains generator filters that can be reused across multiple templates, helping to avoid redundant work. These filters are designed specifically for Nunjucks templates and are included by default with the generator, so there's no need to add them to dependencies separately.

> [!IMPORTANT]
> **Deprecation Notice:** The Nunjucks renderer engine is deprecated and will be removed in future releases. We strongly recommend using the React renderer engine instead. You can find how to migrate from Nunjucks to React in the [migration guide](apps/generator/docs/nunjucks-depreciate.md)

![npm](https://img.shields.io/npm/v/@asyncapi/generator?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@asyncapi/generator?style=for-the-badge)

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Overview](#overview)
- [List of official generator templates](#list-of-official-generator-templates)
- [Filters](#filters)
- [Hooks](#hooks)
- [Contributing](#contributing)
- [Contributors ✨](#contributors-%E2%9C%A8)

<!-- tocstop -->

## Overview

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

## Filters

 `apps/nunjucks-filters` library contains generator filters that can be reused across multiple templates, helping to avoid redundant work. These filters are designed specifically for Nunjucks templates and are included by default with the generator, so there's no need to add them to dependencies separately.

This library consists of:

- Custom filters. Check out [API docs](apps/nunjucks-filters/docs/api.md) for complete list
- Lodash-powered filters. For the list of all available filters check [official docs](https://lodash.com/docs/)

## Hooks

The `apps/hooks` library contains generator filters that can be reused across multiple templates, helping to avoid redundant work. [Hooks](https://www.asyncapi.com/docs/tools/generator/hooks) are functions called by the generator at specific moments in the generation process. Hooks can be anonymous functions, but you can also assign them function names. These hooks can have arguments provided to them, or they may be expected to return a value.

These hooks are included in the generator without adding any specific dependency to the library. You still have to enable the given hook in the configuration explicitly because some hooks can execute automatically without passing a specific parameter. [Learn more about configuration and what hooks are available out of the box](https://www.asyncapi.com/docs/tools/generator/hooks#official-library).

## Contributing

For the development setup, you can follow the detailed guide in [Developement guide](Development.md)

Read [CONTRIBUTING](CONTRIBUTING.md) guide.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="http://www.fmvilas.com"><img src="https://avatars3.githubusercontent.com/u/242119?v=4?s=100" width="100px;" alt="Fran Méndez"/><br /><sub><b>Fran Méndez</b></sub></a><br /><a href="#question-fmvilas" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3Afmvilas" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=fmvilas" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=fmvilas" title="Documentation">📖</a> <a href="#ideas-fmvilas" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-fmvilas" title="Maintenance">🚧</a> <a href="#plugin-fmvilas" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3Afmvilas" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=fmvilas" title="Tests">⚠️</a> <a href="#tutorial-fmvilas" title="Tutorials">✅</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/jonaslagoni"><img src="https://avatars1.githubusercontent.com/u/13396189?v=4?s=100" width="100px;" alt="Jonas Lagoni"/><br /><sub><b>Jonas Lagoni</b></sub></a><br /><a href="#question-jonaslagoni" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3Ajonaslagoni" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=jonaslagoni" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=jonaslagoni" title="Documentation">📖</a> <a href="#ideas-jonaslagoni" title="Ideas, Planning, & Feedback">🤔</a> <a href="#plugin-jonaslagoni" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3Ajonaslagoni" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=jonaslagoni" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://resume.github.io/?derberg"><img src="https://avatars1.githubusercontent.com/u/6995927?v=4?s=100" width="100px;" alt="Lukasz Gornicki"/><br /><sub><b>Lukasz Gornicki</b></sub></a><br /><a href="#question-derberg" title="Answering Questions">💬</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3Aderberg" title="Bug reports">🐛</a> <a href="#blog-derberg" title="Blogposts">📝</a> <a href="https://github.com/asyncapi/generator/commits?author=derberg" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=derberg" title="Documentation">📖</a> <a href="#ideas-derberg" title="Ideas, Planning, & Feedback">🤔</a> <a href="#maintenance-derberg" title="Maintenance">🚧</a> <a href="#plugin-derberg" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3Aderberg" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=derberg" title="Tests">⚠️</a> <a href="#tutorial-derberg" title="Tutorials">✅</a> <a href="#infra-derberg" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://twitter.com/treeder"><img src="https://avatars3.githubusercontent.com/u/75826?v=4?s=100" width="100px;" alt="Travis Reeder"/><br /><sub><b>Travis Reeder</b></sub></a><br /><a href="#infra-treeder" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/generator/commits?author=treeder" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/Tenischev"><img src="https://avatars1.githubusercontent.com/u/4137916?v=4?s=100" width="100px;" alt="Semen"/><br /><sub><b>Semen</b></sub></a><br /><a href="https://github.com/asyncapi/generator/issues?q=author%3ATenischev" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=Tenischev" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=Tenischev" title="Documentation">📖</a> <a href="#ideas-Tenischev" title="Ideas, Planning, & Feedback">🤔</a> <a href="#plugin-Tenischev" title="Plugin/utility libraries">🔌</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3ATenischev" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=Tenischev" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://waleedashraf.me/"><img src="https://avatars0.githubusercontent.com/u/8335457?v=4?s=100" width="100px;" alt="Waleed Ashraf"/><br /><sub><b>Waleed Ashraf</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=WaleedAshraf" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3AWaleedAshraf" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/sebastian-palma"><img src="https://avatars2.githubusercontent.com/u/11888191?v=4?s=100" width="100px;" alt="Sebastián"/><br /><sub><b>Sebastián</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=sebastian-palma" title="Code">💻</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/muenchhausen"><img src="https://avatars.githubusercontent.com/u/1210783?v=4?s=100" width="100px;" alt="Derk Muenchhausen"/><br /><sub><b>Derk Muenchhausen</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=muenchhausen" title="Code">💻</a></td>
      <td align="center" valign="top" width="33.33%"><a href="http://ben.timby.com/"><img src="https://avatars.githubusercontent.com/u/669270?v=4?s=100" width="100px;" alt="Ben Timby"/><br /><sub><b>Ben Timby</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=btimby" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/lkmandy"><img src="https://avatars.githubusercontent.com/u/17765231?v=4?s=100" width="100px;" alt="Amanda  Shafack "/><br /><sub><b>Amanda  Shafack </b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=lkmandy" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/Florence-Njeri"><img src="https://avatars.githubusercontent.com/u/40742916?v=4?s=100" width="100px;" alt="Florence Njeri"/><br /><sub><b>Florence Njeri</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=Florence-Njeri" title="Documentation">📖</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3AFlorence-Njeri" title="Reviewed Pull Requests">👀</a> <a href="#infra-Florence-Njeri" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-Florence-Njeri" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://unruffled-goodall-dd424e.netlify.app/"><img src="https://avatars.githubusercontent.com/u/77961530?v=4?s=100" width="100px;" alt="Pratik Haldankar"/><br /><sub><b>Pratik Haldankar</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=pratik2315" title="Documentation">📖</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3Apratik2315" title="Reviewed Pull Requests">👀</a> <a href="#maintenance-pratik2315" title="Maintenance">🚧</a> <a href="#talk-pratik2315" title="Talks">📢</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/swastiksuvam55"><img src="https://avatars.githubusercontent.com/u/90003260?v=4?s=100" width="100px;" alt="swastik suvam singh"/><br /><sub><b>swastik suvam singh</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=swastiksuvam55" title="Code">💻</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://blog.orzzh.icu/"><img src="https://avatars.githubusercontent.com/u/33168669?v=4?s=100" width="100px;" alt="GavinZhengOI"/><br /><sub><b>GavinZhengOI</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=GavinZhengOI" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/lmgyuan"><img src="https://avatars.githubusercontent.com/u/16447041?v=4?s=100" width="100px;" alt="lmgyuan"/><br /><sub><b>lmgyuan</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=lmgyuan" title="Documentation">📖</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3Almgyuan" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=lmgyuan" title="Code">💻</a> <a href="#ideas-lmgyuan" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3Almgyuan" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=lmgyuan" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/pierrick-boule"><img src="https://avatars.githubusercontent.com/u/3237116?v=4?s=100" width="100px;" alt="pierrick-boule"/><br /><sub><b>pierrick-boule</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=pierrick-boule" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=pierrick-boule" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/generator/commits?author=pierrick-boule" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://dhaiyra-majmudar.netlify.app/"><img src="https://avatars.githubusercontent.com/u/124715224?v=4?s=100" width="100px;" alt="Dhairya Majmudar"/><br /><sub><b>Dhairya Majmudar</b></sub></a><br /><a href="https://github.com/asyncapi/generator/issues?q=author%3ADhairyaMajmudar" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/Gmin2"><img src="https://avatars.githubusercontent.com/u/127925465?v=4?s=100" width="100px;" alt="Mintu Gogoi"/><br /><sub><b>Mintu Gogoi</b></sub></a><br /><a href="https://github.com/asyncapi/generator/issues?q=author%3AGmin2" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=Gmin2" title="Code">💻</a> <a href="#ideas-Gmin2" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/asyncapi/generator/commits?author=Gmin2" title="Documentation">📖</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3AGmin2" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=Gmin2" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
