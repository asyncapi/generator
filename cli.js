#!/usr/bin/env node

const path = require('path');
const os = require('os');
const program = require('commander');
const xfs = require('fs.extra');
const packageInfo = require('./package.json');
const Generator = require('./lib/generator');
const Watcher = require('./lib/watcher');
const { isLocalTemplate, isFilePath } = require('./lib/utils');

const red = text => `\x1b[31m${text}\x1b[0m`;
const magenta = text => `\x1b[35m${text}\x1b[0m`;
const yellow = text => `\x1b[33m${text}\x1b[0m`;
const green = text => `\x1b[32m${text}\x1b[0m`;

let asyncapiDocPath;
let template;
const params = {};
const noOverwriteGlobs = [];
const disabledHooks = {};

const parseOutput = dir => path.resolve(dir);

const paramParser = v => {
  if (!v.includes('=')) throw new Error(`Invalid param ${v}. It must be in the format of --param name=value.`);
  const [paramName, paramValue] = v.split(/=(.+)/, 2);
  params[paramName] = paramValue;
  return v;
};

const noOverwriteParser = v => noOverwriteGlobs.push(v);

const disableHooksParser = v => {
  const [hookType, hookNames] = v.split(/=/);
  if (!hookType) throw new Error('Invalid --disable-hook flag. It must be in the format of: --disable-hook <hookType> or --disable-hook <hookType>=<hookName1>,<hookName2>,...');
  if (hookNames) {
    disabledHooks[hookType] = hookNames.split(/,/);
  } else {
    disabledHooks[hookType] = true;
  }
};

const showError = err => {
  console.error(red('Something went wrong:'));
  console.error(red(err.stack || err.message));
  if (err.errors) console.error(red(JSON.stringify(err.errors)));
  if (err.validationErrors) console.error(red(JSON.stringify(err.validationErrors, null, 4)));
};
const showErrorAndExit = err => {
  showError(err);
  process.exit(1);
};

program
  .version(packageInfo.version)
  .arguments('<asyncapi> <template>')
  .action((fileLoc, tmpl) => {
    asyncapiDocPath = fileLoc;
    template = tmpl;
  })
  .option('-d, --disable-hook [hooks...]', 'disable a specific hook type or hooks from given hook type', disableHooksParser)
  .option('--debug', 'enable more specific errors in the console')
  .option('-i, --install', 'installs the template and its dependencies (defaults to false)')
  .option('-n, --no-overwrite <glob>', 'glob or path of the file(s) to skip when regenerating', noOverwriteParser)
  .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, process.cwd())
  .option('-p, --param <name=value>', 'additional param to pass to templates', paramParser)
  .option('--force-write', 'force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir (defaults to false)')
  .option('--watch-template', 'watches the template directory and the AsyncAPI document, and re-generate the files when changes occur. Ignores the output directory. This flag should be used only for template development.')
  .parse(process.argv);

if (!asyncapiDocPath) {
  console.error(red('> Path or URL to AsyncAPI file not provided.'));
  program.help(); // This exits the process
}
const isAsyncapiDocLocal = isFilePath(asyncapiDocPath);

xfs.mkdirp(program.output, async err => {
  if (err) return showErrorAndExit(err);
  try {
    await generate(program.output);
  } catch (e) {
    return showErrorAndExit(e);
  }

  // If we want to watch for changes do that
  if (program.watchTemplate) {
    let watcher;
    const watchDir = path.resolve(template);
    const outputPath = path.resolve(watchDir, program.output);
    // Template name is needed as it is not always a part of the cli commad
    // There is a use case that you run generator from a root of the template with `./` path
    const templateName = require(path.resolve(watchDir,'package.json')).name;

    if (isAsyncapiDocLocal) {
      console.log(`[WATCHER] Watching for changes in the template directory ${magenta(watchDir)} and in the AsyncAPI file ${magenta(asyncapiDocPath)}`);
      watcher = new Watcher([asyncapiDocPath, watchDir], outputPath);
    } else {
      console.log(`[WATCHER] Watching for changes in the template directory ${magenta(watchDir)}`);
      watcher = new Watcher(watchDir, outputPath);
    }
    // Must check template in its installation path in generator to use isLocalTemplate function
    if (!await isLocalTemplate(path.resolve(Generator.DEFAULT_TEMPLATES_DIR, templateName))) {
      console.warn(`WARNING: ${template} is a remote template. Changes may be lost on subsequent installations.`);
    }
    
    watcher.watch(watcherHandler, (paths) => {
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
        install: program.install,
        debug: program.debug
      });

      if (isAsyncapiDocLocal) {
        await generator.generateFromFile(path.resolve(asyncapiDocPath));
      } else {
        await generator.generateFromURL(asyncapiDocPath);
      }
      console.log(green('\n\nDone! ✨'));
      console.log(`${yellow('Check out your shiny new generated files at ') + magenta(program.output) + yellow('.')}\n`);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

async function watcherHandler(changedFiles) {
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
}

process.on('unhandledRejection', showErrorAndExit);
