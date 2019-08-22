#!/usr/bin/env node

const path = require('path');
const os = require('os');
const program = require('commander');
const packageInfo = require('./package.json');
const mkdirp = require('mkdirp');
const Generator = require('./lib/generator');

const red = text => `\x1b[31m${text}\x1b[0m`;
const magenta = text => `\x1b[35m${text}\x1b[0m`;
const yellow = text => `\x1b[33m${text}\x1b[0m`;
const green = text => `\x1b[32m${text}\x1b[0m`;

let asyncapiFile;
let template;
const params = {};
let entrypointPath;

const parseOutput = dir => path.resolve(dir);

const paramParser = v => {
  if (!v.includes('=')) throw new Error(`Invalid param ${v}. It must be in the format of --param name=value.`);
  const chunks = v.split(/=(.+)/, 2);
  const paramName = chunks[0];
  const paramValue = chunks[1];
  params[paramName] = paramValue;
  return v;
};

const showErrorAndExit = err => {
  console.error(red('Something went wrong:'));
  console.error(red(err.stack || err.message));
  process.exit(1);
};

const setEntrypoint = filePath => {
  entrypointPath = filePath;

  if (!params.hasOwnProperty('inline')) {
    params['inline'] = true;
  }
};

program
  .version(packageInfo.version)
  .arguments('<asyncapi> <template>')
  .action((asyncAPIPath, tmpl) => {
    asyncapiFile = path.resolve(asyncAPIPath);
    template = tmpl;
  })
  .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, process.cwd())
  .option('-t, --templates <templateDir>', 'directory where templates are located (defaults to internal templates directory)', null, path.resolve(__dirname, 'templates'))
  .option('-p, --param <name=value>', 'additional param to pass to templates', paramParser)
  .option('-e, --entrypoint <file>', 'Name of the file to use as the entry point for the rendering process. Note: this potentially avoids rendering every file in the template.', setEntrypoint)
  .parse(process.argv);

if (!asyncapiFile) {
  console.error(red('> Path to AsyncAPI file not provided.'));
  program.help(); // This exits the process
}

mkdirp(program.output, err => {
  if (err) return showErrorAndExit(err);

  let generator;

  try {
    generator = new Generator(template, program.output || path.resolve(os.tmpdir(), 'asyncapi-generator'), {
      templatesDir: program.templates,
      templateParams: params,
      entrypoint: entrypointPath ? path.resolve(`${program.templates}${path.sep}${template}${path.sep}${entrypointPath}`) : null
    });
  } catch (e) {
    return showErrorAndExit(e);
  }

  generator.generateFromFile(asyncapiFile)
    .then(() => {
      console.log(green('Done! ✨'));
      console.log(yellow('Check out your shiny new generated files at ') + magenta(program.output) + yellow('.'));
    })
    .catch(showErrorAndExit);
});

process.on('unhandledRejection', showErrorAndExit);
