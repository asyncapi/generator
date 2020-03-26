## Overview

Contributions are more than welcome. If you want to contribute, please make sure you go through the following steps:

1. Pick or create an issue. 
    - It's always a good idea to leave a message saying that you're going to work on it before you start any actual work.
    - Consider contacting us on [slack](https://www.asyncapi.com/slack-invite/) to discuss the topic first
2. Fork the repository and work there.
3. Open a Pull Request pointing to the `master` branch.
4. A maintainer will review and, eventually, merge your Pull Request. Please, be patient as most of us are doing this in our spare time.

## Code validation

Before creating a Pull Request you should validate your code with ESLint.

```
npm run eslint
```

## Developing with Docker

In case you want to quickly build a docker image locally to check if it works then run `npm run docker-build`

## Conventional commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification. Releasing to GitHub and NPM is done with the support of [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

Pull requests should have a title that follows the specification, otherwise, merging is blocked. If you are not familiar with the specification simply ask maintainers to modify. You can also use this cheatsheet if you want:

- `fix: ` prefix in the title indicates that PR is a bug fix and PATCH release must be triggered.
- `feat: ` prefix in the title indicates that PR is a feature and MINOR release must be triggered.
- `docs: ` prefix in the title indicates that PR is only related to the documentation and there is no need to trigger release.
- `chore: ` prefix in the title indicates that PR is only related to cleanup in the project and there is no need to trigger release.
- `test: ` prefix in the title indicates that PR is only related to tests and there is no need to trigger release.
- `refactor: ` prefix in the title indicates that PR is only related to refactoring and there is no need to trigger release.

What about MAJOR release? just add `!` to the prefix, like `fix!: ` or `refactor!: `

Prefix that follows specification is not enough though. Remember that the title must be clear and descriptive with usage of [imperative mood](https://chris.beams.io/posts/git-commit/#imperative).

Happy contributing :heart: