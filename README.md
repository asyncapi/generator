[![AsyncAPI Generator](./assets/readme-banner.png)](https://www.asyncapi.com/tools/generator)

> Some parts of the AsyncAPI Generator are deprecated and the plan is to remove them in October 2025. For more details read notes from release [@asyncapi/generator@2.6.0](https://github.com/asyncapi/generator/releases/tag/%40asyncapi%2Fgenerator%402.6.0).

This is a Monorepo managed using [Turborepo](https://turbo.build/) and contains the following package:

1. [Generator](apps/generator): This is a tool that you can use to generate whatever you want basing on the AsyncAPI specification file as an input.

1. [Hooks](apps/hooks): This library contains generator filters that can be reused across multiple templates, helping to avoid redundant work. Hooks are designed to let template developers hook into the template generation process. For example, one can create a hook code that will be automatically invoked right after the template generation process has ended.

1. [React-sdk](apps/react-sdk): AsyncAPI React SDK is a set of components/functions to use React as render engine for the generator. This is the library that undestand components from Generator's templates that are configured to use `react` render engine. 

1. [Generator-helpers](packages/helpers): A utility library that provides helper functions and utilities to simplify template development. It reduces boilerplate and speeds up template creation.

1. [Generator-components](packages/components): A library of reusable components that can be shared across different templates, helping to avoid duplication and accelerate template development.

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

> [!IMPORTANT]
> **Experimental Feature:** AsyncAPI Generator also comes with **baked-in templates** - official templates shipped directly inside the Generator (`@asyncapi/generator`). They cover code, docs, configs, and SDKs, and are maintained under [/packages/templates](packages/templates) directory, following a strict, opinionated structure for consistency and ease of maintenance. This feature is not recommended for production use. For those who want to try them out or learn more, see the [Baked-in templates documentation](https://www.asyncapi.com/docs/tools/generator/baked-in-templates).

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
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://linktr.ee/aditya_pat"><img src="https://avatars.githubusercontent.com/u/126982848?v=4?s=100" width="100px;" alt="AdityaPat_"/><br /><sub><b>AdityaPat_</b></sub></a><br /><a href="#infra-AdityaP700" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://achaljhawar.github.io/"><img src="https://avatars.githubusercontent.com/u/35405812?v=4?s=100" width="100px;" alt="Achal Jhawar"/><br /><sub><b>Achal Jhawar</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=achaljhawar" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/ssala034"><img src="https://avatars.githubusercontent.com/u/143904652?v=4?s=100" width="100px;" alt="Shuaib S."/><br /><sub><b>Shuaib S.</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=ssala034" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/generator/commits?author=ssala034" title="Documentation">📖</a> <a href="#infra-ssala034" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/Adi-204"><img src="https://avatars.githubusercontent.com/u/114283933?v=4?s=100" width="100px;" alt="Adi Boghawala"/><br /><sub><b>Adi Boghawala</b></sub></a><br /><a href="https://github.com/asyncapi/generator/issues?q=author%3AAdi-204" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=Adi-204" title="Code">💻</a> <a href="#ideas-Adi-204" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-Adi-204" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3AAdi-204" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=Adi-204" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/generator/commits?author=Adi-204" title="Documentation">📖</a> <a href="#maintenance-Adi-204" title="Maintenance">🚧</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://www.linkedin.com/in/kunalnasa/"><img src="https://avatars.githubusercontent.com/u/111643119?v=4?s=100" width="100px;" alt="Kunal Nasa"/><br /><sub><b>Kunal Nasa</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=KunalNasa" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=KunalNasa" title="Documentation">📖</a> <a href="https://github.com/asyncapi/generator/issues?q=author%3AKunalNasa" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://thulieblack.github.io"><img src="https://avatars.githubusercontent.com/u/66913810?v=4?s=100" width="100px;" alt="V Thulisile Sibanda"/><br /><sub><b>V Thulisile Sibanda</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=thulieblack" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/nightknighto"><img src="https://avatars.githubusercontent.com/u/52013393?v=4?s=100" width="100px;" alt="Ahmed Atwa"/><br /><sub><b>Ahmed Atwa</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=nightknighto" title="Tests">⚠️</a> <a href="#infra-nightknighto" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/Light13008"><img src="https://avatars.githubusercontent.com/u/111660124?v=4?s=100" width="100px;" alt="Sarvesh.Patil"/><br /><sub><b>Sarvesh.Patil</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=Light13008" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3ALight13008" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/ItshMoh"><img src="https://avatars.githubusercontent.com/u/121867882?v=4?s=100" width="100px;" alt="Mohan Kumar"/><br /><sub><b>Mohan Kumar</b></sub></a><br /><a href="https://github.com/asyncapi/generator/pulls?q=is%3Apr+reviewed-by%3AItshMoh" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/asyncapi/generator/commits?author=ItshMoh" title="Code">💻</a> <a href="#ideas-ItshMoh" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/AayushSaini101"><img src="https://avatars.githubusercontent.com/u/60972989?v=4?s=100" width="100px;" alt="Moderator "/><br /><sub><b>Moderator </b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=AayushSaini101" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=AayushSaini101" title="Documentation">📖</a> <a href="https://github.com/asyncapi/generator/commits?author=AayushSaini101" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/blazethunderstorm"><img src="https://avatars.githubusercontent.com/u/149250431?v=4?s=100" width="100px;" alt="ANIRUDH"/><br /><sub><b>ANIRUDH</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=blazethunderstorm" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/Julusian"><img src="https://avatars.githubusercontent.com/u/1327476?v=4?s=100" width="100px;" alt="Julian Waller"/><br /><sub><b>Julian Waller</b></sub></a><br /><a href="https://github.com/asyncapi/generator/issues?q=author%3AJulusian" title="Bug reports">🐛</a> <a href="https://github.com/asyncapi/generator/commits?author=Julusian" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/generator/commits?author=Julusian" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
