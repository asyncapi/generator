#!/usr/bin/env node

/**
 * DEPRECATED CLI - FOR TESTING PURPOSES ONLY
 *
 * This CLI is deprecated and should NOT be used in production.
 * It is kept in the test folder solely for testing the generator functionality during development.
 * Use the AsyncAPI CLI instead for production use cases: https://github.com/asyncapi/cli/
 */

const path = require('path');
const os = require('os');
const program = require('commander');
const xfs = require('fs.extra');
const { DiagnosticSeverity } = require('@asyncapi/parser/cjs');
const packageInfo = require('../package.json');
const Generator = require('../lib/generator');
const { isLocalTemplate, isFilePath } = require('../lib/utils');

const red = text => `\x1b[31m${text}\x1b[0m`;
const magenta = text => `\x1b[35m${text}\x1b[0m`;
const yellow = text => `\x1b[33m${text}\x1b[0m`;
const green = text => `\x1b[32m${text}\x1b[0m`;

let asyncapiDocPath;
let template;
const params = {};
const noOverwriteGlobs = [];
const disabledHooks = {};
const mapBaseUrlToFolder = {};

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

const mapBaseUrlParser = v => {
  // Example value for regular expression: https://schema.example.com/crm/:./test/docs/
  // it splits on last occurrence of : into the groups all, url and folder
  const re = /(.*):(.*)/g;
  let mapping = [];
  if ((mapping = re.exec(v))===null || mapping.length!==3) {
    throw new Error('Invalid --map-base-url flag. A mapping <url>:<folder> with delimiter : expected.');
  }

  // Folder is without trailing slash, so make sure that url has also no trailing slash:
  mapBaseUrlToFolder.url = mapping[1].replace(/\/$/, '');
  mapBaseUrlToFolder.folder = path.resolve(mapping[2]);

  const isURL = /^https?:/;
  if (!isURL.test(mapBaseUrlToFolder.url.toLowerCase())) {
    throw new Error('Invalid --map-base-url flag. The mapping <url>:<folder> requires a valid http/https url and valid folder with delimiter `:`.');
  }
};

const showError = err => {
  console.error(red('Something went wrong:'));
  console.error(red(err.stack || err.message));
  if (err.diagnostics) {
    const errorDiagnostics = err.diagnostics.filter(diagnostic => diagnostic.severity === DiagnosticSeverity.Error);
    console.error(red(`Errors:\n${JSON.stringify(errorDiagnostics, undefined, 2)}`));
  }
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
  .option('--disable-warning', 'disable "ag" deprecation warning (defaults to false)')
  .option('--map-base-url <url:folder>','maps all schema references from base url to local folder',mapBaseUrlParser)
  .parse(process.argv);

if (!program.disableWarning) {
  console.warn(yellow(
    'Warning: The "ag" CLI is deprecated and will be removed in a future release. Please use the AsyncAPI CLI instead. See release notes for details: https://github.com/asyncapi/generator/releases/tag/%40asyncapi%2Fgenerator%402.6.0. You can hide this working using --disable-warning flag.')
  );
}

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
        debug: program.debug,
        mapBaseUrlToFolder
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

process.on('unhandledRejection', showErrorAndExit);
