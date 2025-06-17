# Contributing to AsyncAPI
We love your input! We want to make contributing to this project as easy and transparent as possible.

## Contribution recognition

We use [All Contributors](https://allcontributors.org/docs/en/specification) specification to handle recognitions. For more details read [this](https://github.com/asyncapi/community/blob/master/recognize-contributors.md) document.

## Guidelines for new contributors 

1. Read the [generator docs](https://www.asyncapi.com/docs/tools/generator) to get an overview of what the project is about.
2. While reading through the docs one might identify issues (e.g., broken links, text formatting issues, etc.).
3. Some concepts in the documentation might not be presented clearly, so contributors can suggest improvements (e.g., adding more examples or code snippets to make the documentation easy to understand).
4. Familiarize yourself with the project's structure by reviewing the source code and understanding the roles of different files and components.
5. Testing is one of the areas where new contributors can contribute, as running tests reveals uncovered lines in a particular file (e.g., a **test coverage report**).
6. You can then try to add tests for those uncovered lines (e.g., a function within a file might not be covered). For reference, you can check out this [PR](https://github.com/asyncapi/generator/pull/1379).
7. Instead of creating entirely new tests, consider enhancing existing ones by adding more edge cases to include additional test scenarios.
8. We encourage contributors to help improve code quality by reviewing reported issues on [SonarCloud](https://sonarcloud.io/project/issues?issueStatuses=OPEN%2CCONFIRMED&id=asyncapi_generator) and suggesting improvements, identifying false reported issues that may need to be removed, and proposing fixes for valid issues.

## Few tips for effective contributions

1. **Join the AsyncAPI Slack Workspace** - Connect with maintainers and fellow contributors in the `#generator` channel on [AsyncAPI Slack](https://www.asyncapi.com/slack-invite) to ask questions, share ideas, and get help.  Also, consider attending the **weekly Knowledge Sharing meetings held every Wednesday**, details are shared in the channel.
2. Understanding how the Generator works is key to making valuable contributions. You can start by actively following along and executing the steps given in the [generator template tutorial](https://www.asyncapi.com/docs/tools/generator/generator-template). Hands-on practice will provide you with a comprehensive understanding of how the Generator processes templates and allow you to experiment with customization.
3. **PATIENCE** is crucial. Focus on creating meaningful contributions rather than rushing to submit a PR that adds little or no value to the project.
4. Adding entirely new features might be challenging because most features are already well-established. You may need to spend more time understanding the repository to identify areas for improvement.
5. You should research on Google regarding the @asyncapi/generator and related repositories (e.g., @asyncapi/parser or any of the template repositories) to identify potential improvements. AI can be a helpful assistant, but always double-check the information it provides with Google or StackOverflow.
6. Follow **Issue First, PR Later** - Always check if there’s an existing issue before creating a new one, and raise your PR once the issue is confirmed/approved by any of the maintainers.
7. Keep **PRs small and focused** – A small PR with a well-defined scope is easier to review and merge. Avoid bundling multiple changes into one PR.
8. Collaborate with Other Contributors – If someone else has already raised an issue and you are interested in contributing to it, please communicate with them and collaborate instead of raising a separate PR independently. Working together leads to better contributions and avoids duplication of efforts. Open source is driven by **collaboration, not competition**.

## Summary of the contribution flow

The following is a summary of the ideal contribution flow. Please, note that Pull Requests can also be rejected by the maintainers when appropriate.

```
    ┌───────────────────────┐
    │                       │
    │    Open an issue      │
    │  (a bug report or a   │
    │   feature request)    │
    │                       │
    └───────────────────────┘
               ⇩
    ┌───────────────────────┐
    │                       │
    │  Open a Pull Request  │
    │   (only after issue   │
    │     is approved)      │
    │                       │
    └───────────────────────┘
               ⇩
    ┌───────────────────────┐
    │                       │
    │   Your changes will   │
    │     be merged and     │
    │ published on the next │
    │        release        │
    │                       │
    └───────────────────────┘
```

## Code of Conduct
AsyncAPI has adopted a Code of Conduct that we expect project participants to adhere to. Please [read the full text](./CODE_OF_CONDUCT.md) so that you can understand what sort of behaviour is expected.

## Our Development Process
We use Github to host code, to track issues and feature requests, as well as accept pull requests.

## Issues
[Open an issue](https://github.com/asyncapi/asyncapi/issues/new) **only** if you want to report a bug or a feature. Don't open issues for questions or support, instead join our [Slack workspace](https://www.asyncapi.com/slack-invite) and ask there. Don't forget to follow our [Slack Etiquette](https://github.com/asyncapi/community/blob/master/slack-etiquette.md) while interacting with community members! It's more likely you'll get help, and much faster!

## Bug Reports and Feature Requests

Please use our issues templates that provide you with hints on what information we need from you to help you out.

## Pull Requests

**Please, make sure you open an issue before starting with a Pull Request, unless it's a typo or a really obvious error.** Pull requests are the best way to propose changes to the specification. Get familiar with our document that explains [Git workflow](https://github.com/asyncapi/community/blob/master/git-workflow.md) used in our repositories.

## Conventional commits

Our repositories follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification. Releasing to GitHub and NPM is done with the support of [semantic-release](https://semantic-release.gitbook.io/semantic-release/).

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

## License
When you submit changes, your submissions are understood to be under the same [Apache 2.0 License](https://github.com/asyncapi/asyncapi/blob/master/LICENSE) that covers the project. Feel free to [contact the maintainers](https://www.asyncapi.com/slack-invite) if that's a concern.

## References
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/master/CONTRIBUTING.md).