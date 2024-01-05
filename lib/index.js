
const path = require('path');
const tempOutputResults = '../temp/integrationTestResult';
const outputDir = path.resolve(tempOutputResults, Math.random().toString(36).substring(7));
const templateName = '@asyncapi/html-template';
const Generator = require('../lib/generator');
const gen = new Generator(templateName, outputDir, __dirname, {debug: true, registry: {url: 'http://localhost:4873/', username: 'admin', password: 'nimda'}});
console.log(gen.installTemplate());