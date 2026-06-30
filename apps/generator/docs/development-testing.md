---
title: "Testing"
weight: 220
---

How to run and add tests for the generator. For local setup see [Development setup](/docs/tools/generator/development-setup).

## Running tests

### Local testing

To run all tests locally:

- Unit tests: `npm run generator:test:unit`
- Integration tests: `npm run generator:test:integration`

### Adding tests

1. Create new test files in the appropriate directory under `apps/generator/test/`.

2. Follow the existing test patterns.

3. Run your new tests using the commands mentioned above.

## Docker isolated testing

To run tests in an isolated Docker environment:

1. Ensure Docker is installed and running on your machine, with **Docker Compose v2** (the `docker compose` command, not the legacy `docker-compose` v1). The Compose files use the `pull_policy` key, which is only supported by Compose v2.

2. Run the following command from the project root:

```bash
docker compose up
```

You can also opt in to run the lint checks after the tests, by setting an environment variable `LINT` with any value before the command:
   - Windows: `set LINT=true && docker compose up`
   - Linux/macOS: `LINT=true docker compose up`

> This approach ensures a clean environment for each test run by cleanly installing dependencies and running tests in a Docker container.

### Manually testing with test templates

To test template features, use the `react-template` in `apps/generator/test/test-templates`. You can run your changes against this template as follows:

1. Navigate to the generator directory:

```bash
cd apps/generator
```
2. Modify the react-template in `./test/test-templates/react-template` to test different features.

3. Run the generator with the react-template:

```bash
node ./test/cli ./test/docs/dummy.yml ./test/test-templates/react-template -o ./test/output --force-write
```

4. Check the `./test/output` directory to confirm it matches the output you expected.
