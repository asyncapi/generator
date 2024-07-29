[![AsyncAPI Generator](./assets/readme-banner.png)](https://www.asyncapi.com/tools/generator)

This is a Monorepo managed using [Turborepo](https://turbo.build/) and contains the following package:

1. [Generator](apps/generator): This is a tool that you can use to generate whatever you want basing on the AsyncAPI specification file as an input.

2. [Nunjucks-filters](apps/nunjucks-filters): This library contains generator filters that can be reused across multiple templates, helping to avoid redundant work. These filters are designed specifically for Nunjucks templates and are included by default with the generator, so there's no need to add them to  dependencies seprately.


![npm](https://img.shields.io/npm/v/@asyncapi/generator?style=for-the-badge) ![npm](https://img.shields.io/npm/dt/@asyncapi/generator?style=for-the-badge)

> warning: This package doesn't support AsyncAPI 1.x anymore. We recommend to upgrade to the latest AsyncAPI version using the [AsyncAPI converter](https://github.com/asyncapi/converter-js) (You can refer to [installation guide](/apps/generator//docs//installation-guide.md)). If you need to convert documents on the fly, you may use the [Node.js](https://github.com/asyncapi/converter-js) or [Go](https://github.com/asyncapi/converter-go) converters.

<!-- toc is generated with GitHub Actions do not remove toc markers -->

<!-- toc -->

- [Overview](#overview)
- [List of official generator templates](#list-of-official-generator-templates)
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

# Generator Filters

This library contains generator filters that can be reused across multiple templates, helping to avoid redundant work. These filters are designed specifically for Nunjucks templates and are included by default with the generator, so there's no need to add them to  dependencies seprately.

This library consists of:

- Custom filters. Check out [API docs](apps/nunjucks-filters/docs/api.md) for complete list
- Lodash-powered filters. For the list of all available filters check [official docs](https://lodash.com/docs/)

## Release Process

To release a major/minor/patch:

### Conventional Commits:

To maintain a clear git history of commits and easily identify what each commit changed and whether it triggered a release, we use conventional commits. The feat and fix prefixes are particularly important as they are needed to trigger changesets. Using these prefixes ensures that the changes are correctly categorized and the versioning system functions as expected.

For Example:
```
feat: add new feature
```
    
#### Manual

1.  Create a new release markdown file in the `.changeset` directory. The filename should indicate what the change is about.
  
2.  Add the following content to the file in this particular format:

    ```markdown
    ---
    "@package-name-1": [type] (major/minor/patch)
    "@package-name-2": [type]
    ---

    [Provide a brief description of the changes. For example: Added a new Release GitHub Flow to the Turborepo. No new features or bugfixes were introduced.]
    ```

    For Example:
    
    ```markdown
    ---
    "@asyncapi/generator": minor
    ---

    Adding new Release Github Flow to the Turborepo. No new features or bugfixes were introduced.

    ```

3. Include the file in your pull request.

#### Using CLI

1. Create a new release markdown file using changeset CLI. Below command will trigger an interactive prompt that you can use to specify release type and affected packages.
    ```cli 
    npx -p @changesets/cli@2.27.7 changeset
    ```

2. Include the file in your pull request.

> [!TIP]
> For more detailed instructions, you can refer to the official documentation for creating a changeset:
[Adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)



### Release Flow:

1. **Add a Changeset**:
   - When you make changes that need to be released, create a markdown file in the `.changeset` directory stating the package name and level of change (major/minor/patch). 

2. **Open a Pull Request**:
   - Push your changes and open a Pull Request (PR). After the PR is merged the changeset file helps communicate the type of changes (major, minor, patch).

3. **CI Processes Changeset**:
   - After PR is merged, a dedicated GitHub Actions release workflow runs using changeset action,

   - This action reads the markdown files in the `.changeset` folder and creates a PR with the updated version of the package and removes the markdown file. For example:

     Before:
     ```json
     "name": "@asyncapi/generator",
     "version": "2.0.1",
     ```

     After:
     ```json
     "name": "@asyncapi/generator",
     "version": "3.0.1",
     ```

   - The new PR will also contain the description from the markdown files,

   - AsyncAPI bot automatically merge such release PR.

4. **Release the Package**:

   - After the PR is merged, the CI/CD pipeline triggers again. The `changesets/action` step identifies that the PR was created by itself. It then verifies if the current version of the package is greater than the previously released version. If a difference is detected, it executes the publish command to release the updated package.

## Contributing

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
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/lmgyuan"><img src="https://avatars.githubusercontent.com/u/16447041?v=4?s=100" width="100px;" alt="lmgyuan"/><br /><sub><b>lmgyuan</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=lmgyuan" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="33.33%"><a href="https://github.com/pierrick-boule"><img src="https://avatars.githubusercontent.com/u/3237116?v=4?s=100" width="100px;" alt="pierrick-boule"/><br /><sub><b>pierrick-boule</b></sub></a><br /><a href="https://github.com/asyncapi/generator/commits?author=pierrick-boule" title="Code">💻</a> <a href="https://github.com/asyncapi/generator/commits?author=pierrick-boule" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/generator/commits?author=pierrick-boule" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
