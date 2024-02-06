#!/bin/bash

# Function to install and test a specific project
function test_project {
  echo "##########
Starting standard project test
##########"
  # Copy to isolated env
  cp -r /app /testprojectA
  cd /testprojectA/test/test-project
  npm run test:project:A
  # Copy to isolated env
  cp -r /app /testprojectB
  cd /testprojectB/test/test-project
  npm run test:project:B
  # Copy to isolated env
  cp -r /app /testprojectC
  cd /testprojectC/test/test-project
  npm run test:project:C
  echo "##########
Starting test of global template installation
##########"
  cp -r /app /testprojectglobal
  cd /testprojectglobal/test/test-project
  # Installing html template globally before global tests
  PUPPETEER_SKIP_DOWNLOAD=true npm install -g @asyncapi/html-template@0.16.0
  # Remove previously installed html template to make sure it is not picked up in the test
  rm -rf node_modules/@asyncapi/html-template
  rm -rf ../../node_modules/@asyncapi/html-template
  npm run test:global
}

# Function to test the registry
function test_registry {
  echo "##########
Starting registry test
##########"
  echo "0.0.0.0 registry.npmjs.org" > /etc/hosts # no access to registry.npmjs.org directly
  cp -r /app /testprojectregistry
  cd /testprojectregistry/test/test-project

  npm run test:registry:arg

  npm config set registry http://verdaccio:4873
  #base64 encoded username and password represented as admin:nimda
  npm config set -- //verdaccio:4873/:_auth=YWRtaW46bmltZGE=
  npm run test:registry:npm-config
}

# Required by GitHub Actions
sudo chown -R 1001:121 "/root/.npm"

# Always run these steps
cd app

echo "##########
Running installation in root
##########"
PUPPETEER_SKIP_DOWNLOAD=true npm install
cd test/test-project

echo "##########
Running installation in test-project
##########"
PUPPETEER_SKIP_DOWNLOAD=true npm install

# Run the functions based on the provided arguments
case "$1" in
  "test-project")
    test_project
    test_registry
    ;;
  *)
    echo "Invalid argument. Supported arguments: test-project"
    exit 1
    ;;
esac
