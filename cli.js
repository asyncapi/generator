#!/usr/bin/env node

const path = require('path');
const os = require('os');
const fs = require('fs');
const npmi = require('npmi');
const program = require('commander');
const packageInfo = require('./package.json');
const mkdirp = require('mkdirp');
const Generator = require('./lib/generator');
const Watcher = require('./lib/watcher');

const red = text => `\x1b[31m${text}\x1b[0m`;
const magenta = text => `\x1b[35m${text}\x1b[0m`;
const yellow = text => `\x1b[33m${text}\x1b[0m`;
const green = text => `\x1b[32m${text}\x1b[0m`;

let asyncapiFile;
let template;
const templatesDir = Generator.DEFAULT_TEMPLATES_DIR;
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

const showError = err => {
  console.error(red('Something went wrong:'));
  console.error(red(err.stack || err.message));
  if (err.errors) {
    console.error(red(JSON.stringify(err.errors)));
  }
};
const showErrorAndExit = err => {
  showError(err);
  process.exit(1);
};

program
  .version(packageInfo.version)
  .arguments('<asyncapi> <template>')
  .action((asyncAPIPath, tmpl) => {
    asyncapiFile = path.resolve(asyncAPIPath);
    template = tmpl;
  })
  .option('-w, --watch', 'watches the templates directory and the AsyncAPI document for changes, and re-generate the files when they occur')
  .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, process.cwd())
  .option('-d, --disable-hook <hookName>', 'disable a specific hook', disableHooksParser)
  .option('-n, --no-overwrite <glob>', 'glob or path of the file(s) to skip when regenerating', noOverwriteParser)
  .option('-p, --param <name=value>', 'additional param to pass to templates', paramParser)
  .option('-t, --templates <templateDir>', 'directory where templates are located (defaults to internal templates directory)', Generator.DEFAULT_TEMPLATES_DIR, path.resolve(__dirname, 'templates'))
  .option('--force-install', 'forces the installation of the template dependencies. By default, dependencies are installed and this flag is taken into account only if `node_modules` is not in place.')
  .option('--force-write', 'force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir (defaults to false)')
  .parse(process.argv);

if (!asyncapiFile) {
  console.error(red('> Path to AsyncAPI file not provided.'));
  program.help(); // This exits the process
}

mkdirp(program.output, async err => {
  if (err) return showErrorAndExit(err);
  try {
    await installTemplate(program.forceInstall);
    await generate(program.output);
  } catch (e) {
    return showErrorAndExit(e);
  }

  // If we want to watch for changes do that
  if (program.watch) {
    const watchDir = path.resolve(program.templates, template);
    console.log(`[WATCHER] Watching for changes in the template directory ${magenta(watchDir)} and in the async api file ${magenta(asyncapiFile)}`);

    const watcher = new Watcher([asyncapiFile, watchDir]);
    watcher.watch(async (changedFiles) => {
      console.clear();
      console.log('[WATCHER] Change detected');
      for (const [key, value] of Object.entries(changedFiles)) {
        let eventText;
        switch (value.eventType) {
        case 'changed':
          eventText = green(value.eventType);
          break;
        case 'removed':
          eventText = red(value.eventType);
          break;
        case 'renamed':
          eventText = yellow(value.eventType);
          break;
        default:
          eventText = yellow(value.eventType);
        }
        console.log(`\t${magenta(value.path)} was ${eventText}`);
      }
      console.log('Generating files');
      try {
        await generate(program.output);
      } catch (e) {
        showError(e);
      }
    }, (paths) => {
      showErrorAndExit({ message: `[WATCHER] Could not find the file path ${paths}, are you sure it still exists? If it has been deleted or moved please rerun the generator.` });
    });
  }
});

/**
 * Generates the files based on the template.
 * @param {*} targetDir The path to the target directory.
 */
function generate(targetDir) {
  return new Promise(async (resolve, reject) => {
    try {
      const generator = new Generator(template, targetDir || path.resolve(os.tmpdir(), 'asyncapi-generator'), {
        templatesDir: program.templates,
        templateParams: params,
        noOverwriteGlobs,
        disabledHooks,
        forceWrite: program.forceWrite
      });

      await generator.generateFromFile(asyncapiFile);
      console.log(green('\n\nDone! ✨'));
      console.log(`${yellow('Check out your shiny new generated files at ') + magenta(program.output) + yellow('.')}\n`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Installs template dependencies.
 *
 * @param {Boolean} [force=false] Whether to force installation or not.
 */
function installTemplate(force = false) {
  return new Promise((resolve, reject) => {
    const templateDir = path.resolve(templatesDir, template);
    const nodeModulesDir = path.resolve(templateDir, 'node_modules');
    const templatePackageFile = path.resolve(templateDir, 'package.json');
    const templateDirExists = fs.existsSync(templateDir);
    const templatePackageExists = fs.existsSync(templatePackageFile);
    if (!templateDirExists) return reject(new Error(`Template "${template}" does not exist.`));
    if (!templatePackageExists) return reject(new Error(`Directory "${template}" is not a valid template. Please provide a package.json file.`));
    if (!force && fs.existsSync(nodeModulesDir)) return resolve();

    console.log(magenta('Installing template dependencies...'));

    npmi({
      path: path.resolve(templatesDir, template),
    }, err => {
      if (err) {
        console.error(err.message);
        return reject(err);
      }

      console.log(magenta('Finished installing template dependencies.'));
      resolve();
    });
  });
}

process.on('unhandledRejection', showErrorAndExit);
