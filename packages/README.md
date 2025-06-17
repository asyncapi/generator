# ⚠️ **EXPERIMENTAL FEATURE WARNING** ⚠️

> **Warning:** The following feature is **experimental** and may change without notice. Use at your own risk. This feature is not guaranteed to be stable and should not be used in production environments.


## Overview

This approach with templates developed as part of `generator` repository is a work in progress. This was started because of the following issues:
- [How about a monorepo](https://github.com/asyncapi/generator/issues/1044)
- [Put all (most) templates into the generator together for better developers' experience](https://github.com/asyncapi/generator/issues/1249)
- [Proof of concept of templates as part of generator monorepo](https://github.com/asyncapi/generator/issues/1269)

## Assumptions and Principles

1. When developing templates further, follow the nested folder structure where templates are grouped by their usage purpose. 
2. The idea is that templates inside generator are grouped under a predefined opinionated types, like `client, sdk, docs, scripts`. This is subject to change over time as the development proceeds and we check these types in action:
    - `client` purpose is that the template generates a client library that anyone can easily import and use in their server to interact with the API. In theory, this could also be a client used to develop a server, thus no dedicated `server` type.
    - `sdk` assumption is that people might need a more sophisticated project generation than a simple client. Templates for generating `sdk` should ideally extend the existing `client`.
    - `docs` is for templates that already exist outside this repository, e.g html or markdown generation templates that might be more standard.
    - `scripts` is a rough idea to address the idea that we can generate scripts that one can use to setup topics in a broker.
3. `components` package should contain a set of reusable react components that could be shared between templates.
4. `helpers` package should contain a set of reusable helpers that focus mainly on smart extract of info from AsyncAPI document using the Parser API. Templates should rely on well-tested `helpers` rather than directly using the AsyncAPI Parser API.
5. Each new template or new feature in existing template must be done with reusability in mind. Custom helpers and components should be limited to minimum.
6. Helpers need dedicated tests. Always push for having test cases presented through dummy AsyncAPI documents. Mock fake Parser objects inside tests only is special cases where using dummy document is not an option.
7. Components should also be tested separately, expecially if they are reused across templates.
8. Each template should have a set of snapshot tests that help understand if changes in the PR affect the output of the template. Only template components with conditions require separate testing.
9. Every time new template feature is added it must be consulted with:
   - Spec references docs using [raw docs](https://www.asyncapi.com/docs/reference/specification/v3.0.0) or [visualizer](https://www.asyncapi.com/docs/reference/specification/v3.0.0-explorer) .
   - [Parser API](https://github.com/asyncapi/parser-api/blob/master/docs/api.md) to use it's capabilities instead of doing workarounds like for example `binding.json()["query"]["properties"]`
10. Turporepo gives us a lot of control on tests running. We can for example have `templates:test` script that will run tests only for templates. So we can get very generic and also very granular on tests execution. This is needed in case we want to improve PR testing speed and for example. Depending on the changes in the PR scope, only the relevant tests can be executed.
11. Templates is considered to be of a good quality and ready for use if it has acceptance tests configured using Microcks that provides mocks and runtime. Example implementation available in [tests for websocket](/packages/templates/clients/websocket/test)

