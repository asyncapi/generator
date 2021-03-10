#!/bin/bash
cd app
npm install
cd test/test-project
npm install
npm test
npm install -g @asyncapi/html-template@0.16.0
rm -rf /node_modules/@asyncapi/html-template
rm -rf ../../node_modules/@asyncapi/html-template
npm test:global