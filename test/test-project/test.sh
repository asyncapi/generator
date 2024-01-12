#!/bin/bash

# Function to install and test a specific project
function test_project {
  npm run test:project
  # Installing html template globally before global tests
  PUPPETEER_SKIP_DOWNLOAD=true npm install -g @asyncapi/html-template@0.16.0
  # Remove previously installed html template to make sure it is not picked up in the test
  rm -rf node_modules/@asyncapi/html-template
  rm -rf ../../node_modules/@asyncapi/html-template
  npm run test:global
}

# Function to test the registry
function test_registry {
  npm run test:registry
}

# Required by GitHub Actions
sudo chown -R 1001:121 "/root/.npm"

# Always run these steps
cd app
npm install
cd test/test-project
npm install

# Run the functions based on the provided arguments
case "$1" in
  "test-project")
    test_project
    ;;
  "test-registry")
    test_registry
    ;;
  *)
    echo "Invalid argument. Supported arguments: test-project, test-registry"
    exit 1
    ;;
esac