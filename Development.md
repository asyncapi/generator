# Development Guide

This guide will help you set up the `generator` locally, run tests, and use Docker for isolated testing.

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/asyncapi/generator.git
cd generator
```

2. Install dependencies:

```bash
npm install
```

## Running Tests

### Local Testing

To run all tests locally:

- Unit tests: `npm run generator:test:unit`
- Integration tests: `npm run generator:test:integration`
- CLI tests: `npm run generator:test:cli`

### Adding Tests

1. Create new test files in the appropriate directory under `test/`:

2. Follow the existing test patterns.

3. Run your new tests using the commands mentioned above.

## Docker Isolated Testing

To run tests in an isolated Docker environment:

1. Ensure Docker is installed and running on your machine.

2. Run the following command from the project root:

```bash
docker run --rm -v ${PWD}:/app -w /app node:18 sh -c "
cp -r /app /tmp/app &&
cd /tmp/app &&
npm install &&
npm test
"
```

This command does the following:
- Mounts the current directory to `/app` in the container
- Copies the project to a temporary directory
- Installs dependencies
- Runs all tests

Note: This approach ensures a clean environment for each test run by removing any existing `node_modules`.

## Additional Commands

- Lint the code: `npm run lint`
- Generate documentation: `npm run docs`
- Build Docker image: `npm run docker:build`

## Troubleshooting

If you encounter any issues during development or testing, please check the following:

1. Ensure you're using the correct Node.js version (18.12.0 or higher) and npm version (8.19.0 or higher).
2. Clear the `node_modules` directory and reinstall dependencies if you encounter unexpected behavior.
3. For Docker-related issues, make sure Docker is running and you have sufficient permissions.

If problems persist, please open an issue on the GitHub repository.