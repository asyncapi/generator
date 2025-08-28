# Development guide

This guide will help you set up the `generator` locally, run tests, and use Docker for isolated testing.

## Getting started

1. Fork & Clone the repository:

First fork the repository from github and then clone it,

```bash
git clone https://github.com/{your_username}/generator.git
cd generator
```

After cloning the repository, you should setup the fork properly and configure the `remote` repository as described [here](https://github.com/asyncapi/community/blob/master/git-workflow.md)

2. Install dependencies:

```bash
npm install
```

## Running tests

### Local testing

To run all tests locally:

- Unit tests: `npm run generator:test:unit`
- Integration tests: `npm run generator:test:integration`

### Adding tests

1. Create new test files in the appropriate directory under `apps/generator/test/`:

2. Follow the existing test patterns.

3. Run your new tests using the commands mentioned above.

## Docker isolated testing

To run tests in an isolated Docker environment:

1. Ensure Docker is installed and running on your machine.

2. Run the following command from the project root:

```bash
docker compose up
```

You can also opt in to run the lint checks after the tests, by setting an environment variable `LINT` with any value before the command:
   - Windows: `set LINT=true && docker compose up`
   - Linux/macOS: `LINT=true docker compose up`

> This approach ensures a clean environment for each test run by cleanly installing dependencies and running tests in a Docker container.

### Manually testing with test templates

To test template features manually we have `react-template` and `nunjucks-template` in `apps/generator/test/templates`, you can use this templates to manually test your changes like this:

1. Navigate to the generator directory:

```bash
cd apps/generator
```
2. Modify the react-template in `./test/test-templates/react-template` to test different features.

3. Run the generator with the react-template:

```bash
node ./cli  ./test/docs/dummy.yml ./test/test-templates/react-template -o ./test/output --force-write
```

4. Check the output in the `./test/output` directory to verify the output that you desired.

## Release process

To release a major/minor/patch:

### Conventional Commits:

For a detailed explanation of conventional commits, refer to [this guide](CONTRIBUTING.md#conventional-commits)
To maintain a clear git history of commits and easily identify what each commit changed and whether it triggered a release, we use conventional commits. The feat and fix prefixes are particularly important as they are needed to trigger changesets. Using these prefixes ensures that the changes are correctly categorized and the versioning system functions as expected.

For Example:
```
feat: add new feature
```

### Pull Request Title Guidelines:
To ensure successful workflow execution, all PR titles must follow the Conventional Commits format and PR titles should start with a lowercase character. Incorrect PR titles can cause workflow failures, preventing PRs from being merged.
For the PR titles you can refer to [this guide](CONTRIBUTING.md?plain=1#L60)

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

## Additional commands

- Lint the code: `npm run lint`
- Generate documentation: `npm run docs`
- Build Docker image: `npm run docker:build`


## AI Tools in Development

This project uses AI-powered tools to assist contributors and maintainers:

> [!IMPORTANT]
> Do not paste secrets (API keys, passwords, access tokens) into PR descriptions, comments, or logs. These AI tools process PR content via their respective cloud services to generate feedback.

### CodeRabbit

- **Purpose:** CodeRabbit is an AI assistant integrated into the development workflow. It helps automate code reviews, provides suggestions, and answers contributor questions directly in pull requests and issues.
- **How to use:** When you open a pull request or issue, CodeRabbit may automatically provide feedback, suggestions, or code review comments. You do not need to install anything locally; it works via GitHub integration.
- **Tips:** Engage with CodeRabbit's comments and suggestions as you would with any reviewer. If you have questions about its feedback, reply in the PR or issue thread.
- **More info:** See [CodeRabbit documentation](https://docs.coderabbit.ai/) for details.

### Dosu

- **Purpose:** Dosu is an AI tool used for automated code analysis (e.g., security, dependency, and best‑practice checks). It helps maintain code quality and security standards across the repository.
- **How to use:** Dosu runs automatically on pull requests and pushes. If issues are detected, Dosu will comment with details and remediation steps (and, if applicable in this repo, may set PR checks to failing). No local setup is required.
- **Tips:** Review Dosu's comments and address any flagged issues before merging. Dosu helps ensure your contributions meet project standards.
- **More info:** See [Dosu documentation](https://dosu.dev/docs) for usage and troubleshooting.

#### Privacy and data handling
- PR/issue content may be transmitted to third‑party AI services (CodeRabbit, Dosu) to generate feedback.
- Do not include secrets in any contribution artifacts (descriptions, comments, logs).
See [Security Policy](./SECURITY.md) (if present) for details and reporting instructions.

> [!TIP]
> These AI tools are here to help you contribute more efficiently and maintain high code quality. If you have questions or encounter issues with CodeRabbit or Dosu, ask in the PR/issue or reach out on [AsyncAPI Slack](https://asyncapi.slack.com/).

If problems persist, please open an issue on the repository: [Create new issue](https://github.com/asyncapi/generator/issues/new/choose).

If you encounter any issues during development or testing, please check the following:

1. Ensure you're using the correct Node.js version (18.20.8 or higher) and npm version (10.8.2 or higher).
2. Clear the `node_modules` directory and reinstall dependencies if you encounter unexpected behavior.
3. For Docker-related issues, make sure Docker is running and you have sufficient permissions.

If problems persist, please open an issue on the GitHub repository.


