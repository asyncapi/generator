#!/bin/bash

#required by GitHub Actions
sudo chown -R 1001:121 "/root/.npm"
cd app
npm install
cd test/test-project
PUPPETEER_SKIP_DOWNLOAD=true npm install @asyncapi/html-template@0.16.0
npm install
npm run test:project
#installing html template globally before global tests
PUPPETEER_SKIP_DOWNLOAD=true npm install -g @asyncapi/html-template@0.16.0
#remove previously installed html template to make sure it is not picked up in the test
rm -rf node_modules/@asyncapi/html-template
rm -rf ../../node_modules/@asyncapi/html-template
npm run test:global
npm run test:registry