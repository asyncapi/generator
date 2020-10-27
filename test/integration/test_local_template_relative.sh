#!/usr/bin/env bash
#
# Tests that generation of files from a local folder works

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"


HTML_TEMPLATE_VERSION=0.15.1

##########
# Arrange
##########

cd "$__dir"

# Download template
mkdir -p html-template
curl "https://registry.npmjs.org/@asyncapi/html-template/-/html-template-${HTML_TEMPLATE_VERSION}.tgz" | tar xvf - --strip-components 1 -C ./html-template

mkdir -p test-folder
cd test-folder

cat <<EOM > package.json
{
  "name": "@asyncapi/generator-integration-tests",
  "version": "0.0.0",
  "private": true,
  "devDependencies": {
    "@asyncapi/generator": "file:../../.."
  }
}
EOM

cat <<EOM > simple.yaml
asyncapi: 2.0.0
info:
  title: Account Service
  version: 1.0.0
  description: This service is in charge of processing user signups
channels:
  user/signedup:
    subscribe:
      message:
        \$ref: '#/components/messages/UserSignedUp'
components:
  messages:
    UserSignedUp:
      payload:
        type: object
        properties:
          displayName:
            type: string
            description: Name of the user
          email:
            type: string
            format: email
            description: Email of the user

EOM

echo 'package-lock=false' > .npmrc
npm install


# skip the download for this test
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

#########
# Assert
#########

./node_modules/.bin/ag simple.yaml ../html-template --force-write

########
# clean
########

cd "$__dir"
rm -rf test-folder
rm -rf html-template

