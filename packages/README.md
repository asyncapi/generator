# ⚠️ **EXPERIMENTAL FEATURE WARNING** ⚠️

> **Warning:** The following feature is **experimental** and may change without notice. Use at your own risk. This feature is not guaranteed to be stable and should not be used in production environments.


## Overview

This approach with templates developed as part of `generator` repository is a work in progress. This was started because of the following issues:
- [How about a monorepo](https://github.com/asyncapi/generator/issues/1044)
- [Put all (most) templates into the generator together for better developers' experience](https://github.com/asyncapi/generator/issues/1249)
- [Proof of concept of templates as part of generator monorepo](https://github.com/asyncapi/generator/issues/1269)

## Assumptions and Principles

1. When developing templates further, follow the nested folder structure where templates are group by their usage purpose. 
2. Idea is that templates inside generator are grouped under a predefined opinionated types, like `client, sdk, docs, scripts`. This is a subject to change over time the development proceeds and we check these types in action:
    - `client` purpose is that the template generates a client library that anyone can easily import and use in their server to interact with the API. In theory, this could also be a client used to develop a server, thus no dedicated `server` type
    - `sdk` assumption is that people might need a more sophisticated project generation than simple client. Template do generate `sdk` should ideally extend existing `client`
    - `docs` is for templates that we already have but outside this repo, html or markdown generation, but might be more standards
    - `scripts` is rough idea to address idea that we can just generate script that one can use to setup topics in a broker
3. `components` package should contain a set of reusable react components that could be shared between templates
4. `helpers` package should contain a set of reusable helpers. They would focus mainly on smart extract of info from AsyncAPI document using Parser API. Templates should avoid using AsyncAPI Parser API directly, but through well tested `helpers`
5. Each new template or new feature in existing template must be done with reusability in mind. Custom helpers and components should be limited to minimum
6. Helpers need dedicated tests. Still to agree if we should base these on dummy AsyncAPI documents or just mock fake Parser objects inside tests
7. Components should also be tested separately, expecially if they are reused across templates
8. Each template should have a set of snapshot tests that help understand if changes in the PR affect the output of the template
9. Every time new template feature is added it must be consulted with:
   - Spec reference docs using [raw docs](https://www.asyncapi.com/docs/reference/specification/v3.0.0) or [visualizer](https://www.asyncapi.com/docs/reference/specification/v3.0.0-explorer) 
   - [Parser API](https://github.com/asyncapi/parser-api/blob/master/docs/api.md) to use it's capabilities instead of doing workarounds like for example `binding.json()["query"]["properties"]`
10. Turporepo gives us a lot of control on tests running. We can for example have `templates:test` script that will run tests only for templates. So we can get very generic and also very granular on tests execution. This is needed in case we want to improve PR testing speed and for example, denending on what was changed in the PR scope, run only selected tests

//TODO: we still need to figure out how not only test output changes but also if the output will work with real service: contract testing with mocks. To evaluate Microcks and Specmatic

