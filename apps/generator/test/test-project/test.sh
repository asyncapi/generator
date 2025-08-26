#!/bin/bash

# Function to install and test a specific project
function test_project {
  echo "##########
Starting standard project test
##########"
  # Copy to isolated env
  cp -r /app /testprojectA
  cd /testprojectA/apps/generator/test/test-project
  npm install react-template@0.0.1 # installing old version of template
  npm run test:project:A
  # Copy to isolated env
  cp -r /app /testprojectB
  cd /testprojectB/apps/generator/test/test-project
  npm run test:project:B
  # Copy to isolated env
  cp -r /app /testprojectC
  cd /testprojectC/apps/generator/test/test-project
  npm run test:project:C
  echo "##########
Starting test of global template installation
##########"
  cp -r /app /testprojectglobal
  cd /testprojectglobal/apps/generator/test/test-project
  # Installing test template globally before global tests
  npm install -g react-template@0.0.1
  npm run test:global
}

# Function to test the registry
function test_registry {
  echo "##########
Starting registry test
##########"
  echo "0.0.0.0 registry.npmjs.org" > /etc/hosts # no access to registry.npmjs.org directly
  cp -r /app /testprojectregistry
  cd /testprojectregistry/apps/generator/test/test-project

  npm config delete registry #making sure we do not have verdaccio details in config and test really use library arguments
  npm run test:registry:arg

  #Now running test for npm config support
  npm config set registry http://verdaccio:4873
  #base64 encoded username and password represented as admin:nimda
  npm config set -- //verdaccio:4873/:_auth=YWRtaW46bmltZGE=
  npm run test:registry:npm-config
}

# Required by GitHub Actions
sudo chown -R 1001:121 "/root/.npm"

# Always run these steps
cd /app

echo "##########
Running installation in root
##########"
npm install
npm run build
cd apps/generator/test/test-project

echo "##########
Running installation in test-project
##########"
npm install
npm install --install-links ../.. #installing generator without symlink

echo "##########
Publish test template to local npm-verdaccio
##########"
npm config set -- //verdaccio:4873/:_auth=YWRtaW46bmltZGE=
npm config set registry http://verdaccio:4873

echo "##########
Publish @asyncapi/generator-components to local npm-verdaccio
##########"
npm publish ../../../../packages/components

echo "##########
Publishing the correct template as 0.0.1
##########"
npm publish ../test-templates/react-template

echo "##########
Publishing new version as 0.0.2
##########"
cp -r ../test-templates/react-template ../test-templates/react-template-v2 #we need copy so later in project tests we still have access to old v1 template
new_version="0.0.2"
sed -i 's/"version": "[^"]*"/"version": "'"$new_version"'"/' ../test-templates/react-template-v2/package.json
new_content="import { File, Text } from '@asyncapi/generator-react-sdk'; export default function({ asyncapi, params }) { return ( <File name='test-file.md'> <Text>new content</Text> </File> ); }"
echo "$new_content" > ../test-templates/react-template-v2/template/test-file.md.js
npm publish ../test-templates/react-template-v2

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
