---
title: "Release process"
weight: 230
---

How releases are produced for the generator packages. For local setup see [Development setup](/docs/tools/generator/development-setup).

To release a major/minor/patch:

## Conventional Commits

For a detailed explanation of conventional commits, refer to [this guide](https://github.com/asyncapi/generator/blob/master/CONTRIBUTING.md#conventional-commits).
To maintain a clear git history of commits and easily identify what each commit changed and whether it triggered a release, we use conventional commits. The feat and fix prefixes are particularly important as they are needed to trigger changesets. Using these prefixes ensures that the changes are correctly categorized and the versioning system functions as expected.

For Example:
```
feat: add new feature
```

## Pull Request Title Guidelines

To ensure successful workflow execution, all PR titles must follow the Conventional Commits format and PR titles should start with a lowercase character. Incorrect PR titles can cause workflow failures, preventing PRs from being merged.
For the PR titles you can refer to [this guide](https://github.com/asyncapi/generator/blob/master/CONTRIBUTING.md#conventional-commits)

### Manual

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

### Using CLI

1. Create a new release markdown file using changeset CLI. The command below triggers an interactive prompt that you can use to specify the release type and affected packages.
    ```bash
    npx -p @changesets/cli@2.27.7 changeset
    ```

2. Include the file in your pull request.

> **Tip:**
> For more detailed instructions, refer to the official documentation for [adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md).

## Release Flow

1. **Add a Changeset**:
   - When you make changes that need to be released, create a markdown file in the `.changeset` directory stating the package name and level of change (major/minor/patch).

2. **Open a Pull Request**:
   - Push your changes and open a Pull Request (PR). After the PR is merged the changeset file helps communicate the type of changes (major, minor, patch).

3. **CI Processes Changeset**:
   - After the PR is merged, a dedicated GitHub Actions release workflow runs using the changeset action.

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

   - The new PR will also contain the description from the markdown files.

   - The AsyncAPI bot automatically merges such a release PR.

4. **Release the Package**:

   - After the PR is merged, the CI/CD pipeline triggers again. The `changesets/action` step identifies that the PR was created by itself. It then verifies if the current version of the package is greater than the previously released version. If a difference is detected, it executes the publish command to release the updated package.
