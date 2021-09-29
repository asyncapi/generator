# HTML template for the AsyncAPI Generator
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Usage

```
ag asyncapi.yaml @asyncapi/html-template -o output
```

If you don't have the AsyncAPI Generator installed, you can install it like this:

```
npm install -g @asyncapi/generator
```

## Supported parameters

|Name|Description|Required|Allowed values|Example|
|---|---|---|---|---|
|sidebarOrganization|Defines how the sidebar should be organized. Set its value to `byTagsNoRoot` to categorize operations by operations tags. Set its value to `byTags` when you have tags on a root level. These tags are used to model tags navigation and need to have the same tags in operations.|No|`byTags`, `byTagsNoRoot`|`byTagsNoRoot`|
|baseHref|Sets the base URL for links and forms.|No|*Any*|`/docs`|
|singleFile|Set output into one html-file with styles and scripts inside|No|`true`,`false`|`true`|
|outFilename|The filename of the output file.|No|*Any*|`asyncapi.html`|
|pdf|Generates output HTML as PDF|No|`true,false`|`false`|

## Development

1. Make sure you have the latest generator installed: `npm install -g @asyncapi/generator`.
1. Modify the template or its helper functions. 

    >**NOTE:** If you have to modify the [`dummy.yml`](https://github.com/asyncapi/generator/blob/master/test/docs/dummy.yml) file to develop your features, open a PR with the changes in the [asyncapi/generator](https://github.com/asyncapi/generator) repository.

1. Adjust styling and generate `tailwind.min.css` with `npm run generate:assets`
1. Generate output with watcher enabled: `npm run develop`.
1. Open HTML in your browser: `open ./test/output/index.html`.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.jamescrowley.net"><img src="https://avatars1.githubusercontent.com/u/509533?v=4" width="100px;" alt=""/><br /><sub><b>James Crowley</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=jamescrowley" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3Ajamescrowley" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://waleedashraf.me/"><img src="https://avatars0.githubusercontent.com/u/8335457?v=4" width="100px;" alt=""/><br /><sub><b>Waleed Ashraf</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=WaleedAshraf" title="Code">💻</a> <a href="https://github.com/asyncapi/html-template/issues?q=author%3AWaleedAshraf" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://deltaeight.de"><img src="https://avatars1.githubusercontent.com/u/19175262?v=4" width="100px;" alt=""/><br /><sub><b>Julian Rabe</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=schw4rzlicht" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/sebastian-palma"><img src="https://avatars2.githubusercontent.com/u/11888191?v=4" width="100px;" alt=""/><br /><sub><b>Sebastián</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=sebastian-palma" title="Tests">⚠️</a> <a href="https://github.com/asyncapi/html-template/commits?author=sebastian-palma" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/GordeevArt"><img src="https://avatars2.githubusercontent.com/u/2003488?v=4" width="100px;" alt=""/><br /><sub><b>Gordeev Artem</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=GordeevArt" title="Code">💻</a></td>
    <td align="center"><a href="https://sa.watz.ky"><img src="https://avatars2.githubusercontent.com/u/7246741?v=4" width="100px;" alt=""/><br /><sub><b>Mitchell Sawatzky</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=bufutda" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/HashTalmiz"><img src="https://avatars0.githubusercontent.com/u/55018280?v=4" width="100px;" alt=""/><br /><sub><b>Talmiz Ahmed</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=HashTalmiz" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/jbreitenbaumer/"><img src="https://avatars3.githubusercontent.com/u/683438?v=4" width="100px;" alt=""/><br /><sub><b>Jürgen B.</b></sub></a><br /><a href="#infra-juergenbr" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://codepen.io/gabrielclaudino/"><img src="https://avatars2.githubusercontent.com/u/26636890?v=4" width="100px;" alt=""/><br /><sub><b>Gabriel Claudino</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=gabrielclaudino" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bszwarc"><img src="https://avatars1.githubusercontent.com/u/17266942?v=4" width="100px;" alt=""/><br /><sub><b>Barbara Szwarc</b></sub></a><br /><a href="https://github.com/asyncapi/html-template/commits?author=bszwarc" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
