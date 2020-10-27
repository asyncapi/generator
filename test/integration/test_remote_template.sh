#!/usr/bin/env bash
#
# Tests that generation of files from a npm package in package-lock.json works

set -o errexit
set -o pipefail
set -o nounset
set -o xtrace

__dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

OLD_HTML_TEMPLATE_VERSION=^0.14.2

##########
# Arrange
##########

cd "$__dir"

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

export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

cd "$(dirname "${BASH_SOURCE[0]}")"
npm install
npm install -D "@asyncapi/html-template@${OLD_HTML_TEMPLATE_VERSION}"

#########
# Assert
#########

./node_modules/.bin/ag simple.yaml @asyncapi/html-template --force-write

########
# clean
########

cd "$__dir"

rm -rf test-folder
