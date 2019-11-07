#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
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
const noOverwriteGlobs = [];
const disabledHooks = [];

const parseOutput = dir => path.resolve(dir);

const paramParser = v => {
  if (!v.includes('=')) throw new Error(`Invalid param ${v}. It must be in the format of --param name=value.`);
  const chunks = v.split(/=(.+)/, 2);
  const paramName = chunks[0];
  const paramValue = chunks[1];
  params[paramName] = paramValue;
  return v;
};

const noOverwriteParser = v => noOverwriteGlobs.push(v);
const disableHooksParser = v => disabledHooks.push(v);

const showErrorAndExit = err => {
  console.error(red('Something went wrong:'));
  console.error(red(err.stack || err.message));
  if (err.errors) {
    console.error(red(JSON.stringify(err.errors)));
  }
  process.exit(1);
};

program
  .version(packageInfo.version)
  .arguments('<asyncapi> <template>')
  .action((asyncAPIPath, tmpl) => {
    asyncapiFile = path.resolve(asyncAPIPath);
    template = tmpl;
  })
  .option('-w, --watch', 'Watch the templates directory (--templates) for changes and re-generate when changes occur')
  .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, process.cwd())
  .option('-d, --disable-hook <hookName>', 'disable a specific hook', disableHooksParser)
  .option('-n, --no-overwrite <glob>', 'glob or path of the file(s) to skip when regenerating', noOverwriteParser)
  .option('-p, --param <name=value>', 'additional param to pass to templates', paramParser)
  .option('-t, --templates <templateDir>', 'directory where templates are located (defaults to internal templates directory)', Generator.DEFAULT_TEMPLATES_DIR, path.resolve(__dirname, 'templates'))
  .parse(process.argv);

if (!asyncapiFile) {
  console.error(red('> Path to AsyncAPI file not provided.'));
  program.help(); // This exits the process
}

mkdirp(program.output, err => {
  if (err) return showErrorAndExit(err);
  generate(program.output);

  // If we want to watch for changes do that
  if (program.watch) {
    watch();
  }
});
/**
 * Watches the template folder for changes
 */
function watch() {
  const watchDir = path.resolve(program.templates, template);
  console.log(`[WATCHER] Watching for changes in ${magenta(watchDir)}`);
  let fsWait = false;
  const watcher = fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
    // Since multiple changes can occur, lets wait a bit before processing.
    if (fsWait) return;
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    console.clear();
    console.log('[WATCHER] Change detected, generating new code.');
    generate();
    // Close the previous watcher to ensure no dublicate generations.
    watcher.close();
    watch();
  });
}

/**
 * Generates the files based on the template.
 * @param {*} targetDir The path to the target directory.
 */
function generate(targetDir) {
  try {
    const generator = new Generator(template, targetDir || path.resolve(os.tmpdir(), 'asyncapi-generator'), {
      templatesDir: program.templates,
      templateParams: params,
      noOverwriteGlobs,
      disabledHooks,
    });

    generator.generateFromFile(asyncapiFile);
    console.log(green('Done! ✨'));
    console.log(`${yellow('Check out your shiny new generated files at ') + magenta(program.output) + yellow('.')}\n`);
  } catch (e) {
    return showErrorAndExit(e);
  }
}

process.on('unhandledRejection', showErrorAndExit);
