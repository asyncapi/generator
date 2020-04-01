#!/usr/bin/env node

const path = require('path');
const os = require('os');
const program = require('commander');
const xfs = require('fs.extra');
const packageInfo = require('./package.json');
const Generator = require('./lib/generator');
const Watcher = require('./lib/watcher');
const { isLocalTemplate } = require('./lib/utils');

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
  .option('-d, --disable-hook <hookName>', 'disable a specific hook', disableHooksParser)
  .option('-i, --install', 'installs the template and its dependencies (defaults to false)')
  .option('-n, --no-overwrite <glob>', 'glob or path of the file(s) to skip when regenerating', noOverwriteParser)
  .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, process.cwd())
  .option('-p, --param <name=value>', 'additional param to pass to templates', paramParser)
  .option('--force-write', 'force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir (defaults to false)')
  .option('--watch-template', 'watches the template directory and the AsyncAPI document, and re-generate the files when changes occur')
  .parse(process.argv);

if (!asyncapiFile) {
  console.error(red('> Path to AsyncAPI file not provided.'));
  program.help(); // This exits the process
}

xfs.mkdirp(program.output, async err => {
  if (err) return showErrorAndExit(err);
  try {
    await generate(program.output);
  } catch (e) {
    return showErrorAndExit(e);
  }

  // If we want to watch for changes do that
  if (program.watchTemplate) {
    const watchDir = path.resolve(Generator.DEFAULT_TEMPLATES_DIR, template);
    console.log(`[WATCHER] Watching for changes in the template directory ${magenta(watchDir)} and in the AsyncAPI file ${magenta(asyncapiFile)}`);

    if (!(await isLocalTemplate(watchDir))) {
      console.warn(`WARNING: ${template} is a remote template. Changes may be lost on subsequent installations.`);
    }

    const watcher = new Watcher([asyncapiFile, watchDir]);
    watcher.watch(async (changedFiles) => {
      console.clear();
      console.log('[WATCHER] Change detected');
      for (const [, value] of Object.entries(changedFiles)) {
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
        templateParams: params,
        noOverwriteGlobs,
        disabledHooks,
        forceWrite: program.forceWrite,
        forceInstall: program.install,
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

process.on('unhandledRejection', showErrorAndExit);
