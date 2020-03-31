const path = require('path');
const fs = require('fs');
const xfs = require('fs.extra');
const walkSync = require('klaw-sync');
const minimatch = require('minimatch');
const parser = require('@asyncapi/parser');
const { parse, AsyncAPIDocument } = parser;
const ramlDtParser = require('@asyncapi/raml-dt-schema-parser');
const openapiSchemaParser = require('@asyncapi/openapi-schema-parser');
const Nunjucks = require('nunjucks');
const jmespath = require('jmespath');
const Ajv = require('ajv');
const filenamify = require('filenamify');
const git = require('simple-git/promise');
const npmi = require('npmi');
const {
  convertMapToObject,
  isFileSystemPath,
  beautifyNpmiResult,
  isLocalTemplate,
  getLocalTemplateDetails,
  readFile,
  readDir,
  writeFile,
  copyFile,
  exists,
} = require('./utils');

const ajv = new Ajv({ allErrors: true });

parser.registerSchemaParser([
  'application/vnd.oai.openapi;version=3.0.0',
  'application/vnd.oai.openapi+json;version=3.0.0',
  'application/vnd.oai.openapi+yaml;version=3.0.0',
], openapiSchemaParser);

parser.registerSchemaParser([
  'application/raml+yaml;version=1.0',
], ramlDtParser);

const FILTERS_DIRNAME = 'filters';
const HOOKS_DIRNAME = 'hooks';
const CONFIG_FILENAME = '.tp-config.json';
const PACKAGE_JSON_FILENAME = 'package.json';
const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_TEMPLATES_DIR = path.resolve(ROOT_DIR, 'node_modules');
const TEMPLATE_CONTENT_DIRNAME = 'template';

const shouldIgnoreFile = filePath =>
  filePath.startsWith(`.git${path.sep}`);

const shouldIgnoreDir = dirPath =>
  dirPath === '.git'
  || dirPath.startsWith(`.git${path.sep}`);

class Generator {
  /**
   * Instantiates a new Generator object.
   *
   * @example
   * const path = require('path');
   * const generator = new Generator('html', path.resolve(__dirname, 'example'));
   *
   * @example <caption>Passing custom params to the template</caption>
   * const path = require('path');
   * const generator = new Generator('html', path.resolve(__dirname, 'example'), {
   *   templateParams: {
   *     sidebarOrganization: 'byTags'
   *   }
   * });
   *
   * @param {String} templateName  Name of the template to generate.
   * @param {String} targetDir     Path to the directory where the files will be generated.
   * @param {Object} options
   * @param {String} [options.templateParams]   Optional parameters to pass to the template. Each template define their own params.
   * @param {String} [options.entrypoint]       Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template.
   * @param {String[]} [options.noOverwriteGlobs] List of globs to skip when regenerating the template.
   * @param {String[]} [options.disabledHooks] List of hooks to disable.
   * @param {String} [options.output='fs'] Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set.
   * @param {Boolean} [options.forceWrite=false] Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false.
   * @param {Boolean} [options.install=false] Install the template and its dependencies, even when the template has already been installed.
   */
  constructor(templateName, targetDir, { templateParams = {}, entrypoint, noOverwriteGlobs, disabledHooks, output = 'fs', forceWrite = false, install = false } = {}) {
    if (!templateName) throw new Error('No template name has been specified.');
    if (!entrypoint && !targetDir) throw new Error('No target directory has been specified.');
    if (!['fs', 'string'].includes(output)) throw new Error(`Invalid output type ${output}. Valid values are 'fs' and 'string'.`);

    this.templateName = templateName;
    this.targetDir = targetDir;
    this.entrypoint = entrypoint;
    this.noOverwriteGlobs = noOverwriteGlobs || [];
    this.disabledHooks = disabledHooks || [];
    this.output = output;
    this.forceWrite = forceWrite;
    this.install = install;

    // Load template configuration
    this.templateParams = {};
    Object.keys(templateParams).forEach(key => {
      const self = this;
      Object.defineProperty(this.templateParams, key, {
        get() {
          if (!self.templateConfig.parameters || !self.templateConfig.parameters[key]) {
            throw new Error(`Template parameter "${key}" has not been defined in the .tp-config.json file. Please make sure it's listed there before you use it in your template.`);
          }
          return templateParams[key];
        }
      });
    });
  }

  /**
   * Generates files from a given template and an AsyncAPIDocument object.
   *
   * @example
   * generator
   *   .generate(myAsyncAPIdocument)
   *   .then(() => {
   *     console.log('Done!');
   *   })
   *   .catch(console.error);
   *
   * @example <caption>Using async/await</caption>
   * try {
   *   await generator.generate(myAsyncAPIdocument);
   *   console.log('Done!');
   * } catch (e) {
   *   console.error(e);
   * }
   *
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPIDocument object to use as source.
   * @return {Promise}
   */
  async generate(asyncapiDocument) {
    if (!(asyncapiDocument instanceof AsyncAPIDocument)) throw new Error('Parameter "asyncapiDocument" must be an AsyncAPIDocument object.');

    try {
      if (!this.forceWrite) await this.verifyTargetDir(this.targetDir);
      const { name: templatePkgName, path: templatePkgPath } = await this.installTemplate(this.install);
      this.templateDir = templatePkgPath;
      this.templateName = templatePkgName;
      this.templateContentDir = path.resolve(this.templateDir, TEMPLATE_CONTENT_DIRNAME);
      this.configNunjucks();
      await this.loadTemplateConfig();
      this.registerHooks();
      await this.registerFilters();

      if (this.entrypoint) {
        const entrypointPath = path.resolve(this.templateContentDir, this.entrypoint);
        if (!(await exists(entrypointPath))) throw new Error(`Template entrypoint "${entrypointPath}" couldn't be found.`);
        if (this.output === 'fs') {
          await this.generateFile(asyncapiDocument, path.basename(entrypointPath), path.dirname(entrypointPath));
          await this.launchHook('generate:after');
          return;
        } else if (this.output === 'string') {
          return this.renderString(asyncapiDocument, await readFile(entrypointPath, { encoding: 'utf8' }), entrypointPath);
        }
      }
      await this.validateTemplateConfig(asyncapiDocument);
      await this.generateDirectoryStructure(asyncapiDocument);
      await this.launchHook('generate:after');
    } catch (e) {
      throw e;
    }
  }

  /**
   * Generates files from a given template and AsyncAPI string.
   *
   * @example
   * const asyncapiString = `
   * asyncapi: '2.0.0'
   * info:
   *   title: Example
   *   version: 1.0.0
   * ...
   * `;
   * generator
   *   .generateFromString(asyncapiString)
   *   .then(() => {
   *     console.log('Done!');
   *   })
   *   .catch(console.error);
   *
   * @example <caption>Using async/await</caption>
   * const asyncapiString = `
   * asyncapi: '2.0.0'
   * info:
   *   title: Example
   *   version: 1.0.0
   * ...
   * `;
   *
   * try {
   *   await generator.generateFromString(asyncapiString);
   *   console.log('Done!');
   * } catch (e) {
   *   console.error(e);
   * }
   *
   * @param  {String} asyncapiString AsyncAPI string to use as source.
   * @param  {String} [asyncApiFileLocation] AsyncAPI file location, used by the @asyncapi/parser for references.
   * @return {Promise}
   */
  async generateFromString(asyncapiString, asyncApiFileLocation) {
    if (!asyncapiString || typeof asyncapiString !== 'string') throw new Error('Parameter "asyncapiString" must be a non-empty string.');

    this.originalAsyncAPI = asyncapiString;
    const parseOptions = {};

    if (asyncApiFileLocation) {
      parseOptions.path = asyncApiFileLocation;
    }

    try {
      this.asyncapi = await parse(asyncapiString, parseOptions);
      return this.generate(this.asyncapi);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Generates files from a given template and AsyncAPI file.
   *
   * @example
   * generator
   *   .generateFromFile('asyncapi.yaml')
   *   .then(() => {
   *     console.log('Done!');
   *   })
   *   .catch(console.error);
   *
   * @example <caption>Using async/await</caption>
   * try {
   *   await generator.generateFromFile('asyncapi.yaml');
   *   console.log('Done!');
   * } catch (e) {
   *   console.error(e);
   * }
   *
   * @param  {String} asyncapiFile AsyncAPI file to use as source.
   * @return {Promise}
   */
  async generateFromFile(asyncapiFile) {
    try {
      const doc = await readFile(asyncapiFile, { encoding: 'utf8' });
      return this.generateFromString(doc, asyncapiFile);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Returns the content of a given template file.
   *
   * @example
   * const Generator = require('asyncapi-generator');
   * const content = await Generator.getTemplateFile('html', 'partials/content.html');
   *
   * @static
   * @param {String} templateName  Name of the template to generate.
   * @param {String} filePath      Path to the file to render. Relative to the template directory.
   * @param {Object} options
   * @return {Promise}
   */
  static async getTemplateFile(templateName, filePath) {
    return await readFile(path.resolve(DEFAULT_TEMPLATES_DIR, templateName, filePath), 'utf8');
  }

  /**
   * Downloads and installs a template and its dependencies.
   *
   * @param {Boolean} [force=false] Whether to force installation (and skip cache) or not.
   */
  installTemplate(force = false) {
    return new Promise(async (resolve, reject) => {
      if (!force) {
        try {
          let installedPkg;

          if (isFileSystemPath(this.templateName)) {
            const pkg = require(path.resolve(this.templateName, PACKAGE_JSON_FILENAME));
            installedPkg = require(path.resolve(DEFAULT_TEMPLATES_DIR, pkg.name, PACKAGE_JSON_FILENAME));
          } else { // Template is not a filesystem path...
            const templatePath = path.resolve(DEFAULT_TEMPLATES_DIR, this.templateName);
            if (await isLocalTemplate(templatePath)) {
              const { resolvedLink } = await getLocalTemplateDetails(templatePath);
              console.info(`This template has already been installed and it's pointing to your filesystem at ${resolvedLink}.`);
            }
            installedPkg = require(path.resolve(templatePath, PACKAGE_JSON_FILENAME));
          }


          return resolve({
            name: installedPkg.name,
            version: installedPkg.version,
            path: path.resolve(DEFAULT_TEMPLATES_DIR, installedPkg.name),
          });
        } catch (e) {
          // We did our best. Proceed with installation...
        }
      }

      npmi({
        name: this.templateName,
        install: force,
        pkgName: 'dummy value so it does not force installation always',
        npmLoad: {
          loglevel: 'http',
          save: false,
          audit: false,
          progress: false,
        },
      }, (err, result) => {
        if (err) return reject(err);
        resolve(beautifyNpmiResult(result));
      });
    });
  }

  /**
   * Registers the template filters.
   * @private
   */
  registerFilters() {
    return new Promise((resolve, reject) => {
      this.helpersDir = path.resolve(this.templateDir, FILTERS_DIRNAME);
      if (!fs.existsSync(this.helpersDir)) return resolve();

      const walker = xfs.walk(this.helpersDir, {
        followLinks: false
      });

      walker.on('file', async (root, stats, next) => {
        try {
          const filePath = path.resolve(this.templateDir, path.resolve(root, stats.name));
          // If it's a module constructor, inject dependencies to ensure consistent usage in remote templates in other projects or plain directories.
          const mod = require(filePath);
          if (typeof mod === 'function') {
            mod({ Nunjucks: this.nunjucks });
          }
          next();
        } catch (e) {
          reject(e);
        }
      });

      walker.on('errors', (root, nodeStatsArray) => {
        reject(nodeStatsArray);
      });

      walker.on('end', async () => {
        resolve();
      });
    });
  }

  /**
   * Returns all the parameters on the AsyncAPI document.
   *
   * @private
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   */
  getAllParameters(asyncapiDocument) {
    const parameters = new Map();

    if (asyncapiDocument.hasChannels()) {
      asyncapiDocument.channelNames().forEach(channelName => {
        const channel = asyncapiDocument.channel(channelName);
        for (const [key, value] of Object.entries(channel.parameters())) {
          parameters.set(key, value);
        }
      });
    }

    if (asyncapiDocument.hasComponents()) {
      for (const [key, value] of Object.entries(asyncapiDocument.components().parameters())) {
        parameters.set(key, value);
      }
    }

    return parameters;
  }

  /**
   * Generates the directory structure.
   *
   * @private
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @return {Promise}
   */
  generateDirectoryStructure(asyncapiDocument) {
    const fileNamesForSeparation = {
      channel: asyncapiDocument.channels(),
      message: convertMapToObject(asyncapiDocument.allMessages()),
      securityScheme: asyncapiDocument.components() ? asyncapiDocument.components().securitySchemes() : {},
      schema: asyncapiDocument.components() ? asyncapiDocument.components().schemas() : {},
      parameter: convertMapToObject(this.getAllParameters(asyncapiDocument)),
      everySchema: convertMapToObject(asyncapiDocument.allSchemas()),
    };

    return new Promise((resolve, reject) => {
      xfs.mkdirpSync(this.targetDir);

      const walker = xfs.walk(this.templateContentDir, {
        followLinks: false
      });

      walker.on('file', async (root, stats, next) => {
        try {
          // Check if the filename dictates it should be separated
          let wasSeparated = false;
          for (const prop in fileNamesForSeparation) {
            if (Object.prototype.hasOwnProperty.call(fileNamesForSeparation, prop)) {
              if (stats.name.includes(`$$${prop}$$`)) {
                await this.generateSeparateFiles(asyncapiDocument, fileNamesForSeparation[prop], prop, stats.name, root);
                const templateFilePath = path.relative(this.templateContentDir, path.resolve(root, stats.name));
                fs.unlink(path.resolve(this.targetDir, templateFilePath), next);
                wasSeparated = true;
                //The filename can only contain 1 specifier (message, scheme etc)
                break;
              }
            }
          }
          // If it was not separated process normally
          if (!wasSeparated) {
            await this.generateFile(asyncapiDocument, stats.name, root);
            next();
          }
        } catch (e) {
          reject(e);
        }
      });

      walker.on('directory', async (root, stats, next) => {
        try {
          const relativeDir = path.relative(this.templateContentDir, path.resolve(root, stats.name));
          const dirPath = path.resolve(this.targetDir, relativeDir);
          if (!shouldIgnoreDir(relativeDir)) {
            xfs.mkdirpSync(dirPath);
          }
          next();
        } catch (e) {
          reject(e);
        }
      });

      walker.on('errors', (root, nodeStatsArray) => {
        reject(nodeStatsArray);
      });

      walker.on('end', async () => {
        resolve();
      });
    });
  }

  /**
   * Generates all the files for each in array
   *
   * @private
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param  {Array} array The components/channels to generate the separeted files for.
   * @param  {String} template The template filename to replace.
   * @param  {String} fileName Name of the file to generate for each security schema.
   * @param  {String} baseDir Base directory of the given file name.
   * @returns {Promise}
   */
  generateSeparateFiles(asyncapiDocument, array, template, fileName, baseDir) {
    const promises = [];

    Object.keys(array).forEach((name) => {
      const component = array[name];
      promises.push(this.generateSeparateFile(asyncapiDocument, name, component, template, fileName, baseDir));
    });

    return Promise.all(promises);
  }

  /**
   * Generates a file for a component/channel
   *
   * @private
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param  {String} name The name of the component (filename to use)
   * @param  {Object} component The component/channel object used to generate the file.
   * @param  {String} template The template filename to replace.
   * @param  {String} fileName Name of the file to generate for each security schema.
   * @param  {String} baseDir Base directory of the given file name.
   * @returns {Promise}
   */
  async generateSeparateFile(asyncapiDocument, name, component, template, fileName, baseDir) {
    try {
      const relativeBaseDir = path.relative(this.templateContentDir, baseDir);
      const newFileName = fileName.replace(`\$\$${template}\$\$`, filenamify(name, { replacement: '-', maxLength: 255 }));
      const targetFile = path.resolve(this.targetDir, relativeBaseDir, newFileName);
      const relativeTargetFile = path.relative(this.targetDir, targetFile);

      const shouldOverwriteFile = await this.shouldOverwriteFile(relativeTargetFile);
      if (!shouldOverwriteFile) return;
      //Ensure the same object are parsed to the renderFile method as before.
      const temp = {};
      const key = template === 'everySchema' ? 'schema' : template;
      temp[`${key}Name`] = name;
      temp[key] = component;
      const content = await this.renderFile(asyncapiDocument, path.resolve(baseDir, fileName), temp);

      await writeFile(targetFile, content, 'utf8');
    } catch (e) {
      throw e;
    }
  }

  /**
   * Generates a file.
   *
   * @private
   * @param {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param {String} fileName Name of the file to generate for each channel.
   * @param {String} baseDir Base directory of the given file name.
   * @return {Promise}
   */
  async generateFile(asyncapiDocument, fileName, baseDir) {
    try {
      const sourceFile = path.resolve(baseDir, fileName);
      const relativeSourceFile = path.relative(this.templateContentDir, sourceFile);
      const targetFile = path.resolve(this.targetDir, relativeSourceFile);
      const relativeTargetFile = path.relative(this.targetDir, targetFile);

      if (shouldIgnoreFile(relativeSourceFile)) return;

      if (this.isNonRenderableFile(relativeSourceFile)) {
        return await copyFile(sourceFile, targetFile);
      }

      const shouldOverwriteFile = await this.shouldOverwriteFile(relativeTargetFile);
      if (!shouldOverwriteFile) return;

      if (this.templateConfig.conditionalFiles && this.templateConfig.conditionalFiles[relativeSourceFile]) {
        const server = this.templateParams.server && asyncapiDocument.server(this.templateParams.server);
        const source = jmespath.search({
          ...asyncapiDocument.json(),
          ...{
            server: server ? server.json() : undefined,
          },
        }, this.templateConfig.conditionalFiles[relativeSourceFile].subject);

        if (source) {
          const validate = this.templateConfig.conditionalFiles[relativeSourceFile].validate;
          const valid = validate(source);
          if (!valid) return;
        }
      }

      const parsedContent = await this.renderFile(asyncapiDocument, sourceFile);
      const stats = fs.statSync(sourceFile);
      await writeFile(targetFile, parsedContent, { encoding: 'utf8', mode: stats.mode });
    } catch (e) {
      throw e;
    }
  }

  /**
   * Renders a template string and outputs it.
   *
   * @private
   * @param {AsyncAPIDocument} asyncapiDocument AsyncAPI document to pass to the template.
   * @param {String} templateString String containing the template.
   * @param {String} filePath Path to the file being rendered.
   * @param {Object} [extraTemplateData] Extra data to pass to the template.
   * @return {Promise}
   */
  renderString(asyncapiDocument, templateString, filePath, extraTemplateData = {}) {
    return new Promise((resolve, reject) => {
      this.nunjucks.renderString(templateString, {
        asyncapi: asyncapiDocument,
        params: this.templateParams,
        originalAsyncAPI: this.originalAsyncAPI,
        ...extraTemplateData
      }, { path: filePath }, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  /**
   * Renders the content of a file and outputs it.
   *
   * @private
   * @param {AsyncAPIDocument} asyncapiDocument AsyncAPI document to pass to the template.
   * @param {String} filePath Path to the file you want to render.
   * @param {Object} [extraTemplateData] Extra data to pass to the template.
   * @return {Promise}
   */
  async renderFile(asyncapiDocument, filePath, extraTemplateData = {}) {
    try {
      const content = await readFile(filePath, 'utf8');
      return this.renderString(asyncapiDocument, content, filePath, extraTemplateData);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Checks if a given file name matches the list of non-renderable files.
   *
   * @private
   * @param  {string} fileName Name of the file to check against a list of glob patterns.
   * @return {boolean}
   */
  isNonRenderableFile(fileName) {
    if (!Array.isArray(this.templateConfig.nonRenderableFiles)) return false;

    return this.templateConfig.nonRenderableFiles.some(globExp => minimatch(fileName, globExp));
  }

  /**
   * Checks if a given file should be overwritten.
   *
   * @private
   * @param  {string} filePath Path to the file to check against a list of glob patterns.
   * @return {boolean}
   */
  async shouldOverwriteFile(filePath) {
    if (!Array.isArray(this.noOverwriteGlobs)) return true;
    const fileExists = await exists(path.resolve(this.targetDir, filePath));
    if (!fileExists) return true;

    return !this.noOverwriteGlobs.some(globExp => minimatch(filePath, globExp));
  }

  /**
   * Configures Nunjucks templating system
   * @private
   */
  configNunjucks() {
    this.nunjucks = new Nunjucks.Environment(new Nunjucks.FileSystemLoader(this.templateDir));
    this.nunjucks.addFilter('log', console.log);
  }

  /**
   * Loads the template configuration.
   * @private
   */
  async loadTemplateConfig() {
    try {
      const configPath = path.resolve(this.templateDir, CONFIG_FILENAME);
      if (!fs.existsSync(configPath)) {
        this.templateConfig = {};
        return;
      }

      const json = fs.readFileSync(configPath, { encoding: 'utf8' });
      this.templateConfig = JSON.parse(json);
    } catch (e) {
      this.templateConfig = {};
    }

    await this.validateTemplateConfig();
  }

  /**
   * Validates the template configuration.
   *
   * @private
   * @param  {AsyncAPIDocument} [asyncapiDocument] AsyncAPIDocument object to use as source.
   * @return {Promise}
   */
  async validateTemplateConfig(asyncapiDocument) {
    const { parameters, supportedProtocols, conditionalFiles } = this.templateConfig;
    let server;

    const requiredParams = [];
    Object.keys(parameters || {}).forEach(key => {
      if (parameters[key].required === true) requiredParams.push(key);
    });

    if (Array.isArray(requiredParams)) {
      const missingParams = requiredParams.filter(rp => this.templateParams[rp] === undefined);
      if (missingParams.length) {
        throw new Error(`This template requires the following missing params: ${missingParams}.`);
      }
    }

    if (typeof conditionalFiles === 'object') {
      const fileNames = Object.keys(conditionalFiles) || [];
      fileNames.forEach(fileName => {
        const def = conditionalFiles[fileName];
        if (typeof def.subject !== 'string') throw new Error(`Invalid conditional file subject for ${fileName}: ${def.subject}.`);
        if (typeof def.validation !== 'object') throw new Error(`Invalid conditional file validation object for ${fileName}: ${def.validation}.`);
        conditionalFiles[fileName].validate = ajv.compile(conditionalFiles[fileName].validation);
      });
    }

    if (asyncapiDocument) {
      if (typeof this.templateParams.server === 'string') {
        server = asyncapiDocument.server(this.templateParams.server);
        if (!server) throw new Error(`Couldn't find server with name ${this.templateParams.server}.`);
      }

      if (server && Array.isArray(supportedProtocols)) {
        if (!supportedProtocols.includes(server.protocol())) {
          throw new Error(`Server "${this.templateParams.server}" uses the ${server.protocol()} protocol but this template only supports the following ones: ${supportedProtocols}.`);
        }
      }
    }
  }

  /**
   * Loads the template hooks.
   * @private
   */
  registerHooks() {
    try {
      this.hooks = {};
      const hooksPath = path.resolve(this.templateDir, HOOKS_DIRNAME);
      if (!fs.existsSync(hooksPath)) return this.hooks;

      const files = walkSync(hooksPath, { nodir: true });
      files.forEach(file => {
        require(file.path)((when, hook) => {
          this.hooks[when] = this.hooks[when] || [];
          this.hooks[when].push(hook);
        });
      });
    } catch (e) {
      e.message = `There was a problem registering the hooks: ${e.message}`;
      throw e;
    }
  }

  /**
   * Launches all the hooks registered at a given hook point/name.
   * @private
   */
  async launchHook(hookName) {
    if (this.disabledHooks.includes(hookName)) return;
    if (!Array.isArray(this.hooks[hookName])) return;

    const promises = this.hooks[hookName].map(async (hook) => {
      if (typeof hook !== 'function') return;
      await hook(this);
    });

    return Promise.all(promises);
  }

  /**
   * Check if given directory is a git repo with unstaged changes and is not in .gitignore or is not empty
   * @private
   * @param  {String} dir Directory that needs to be tested for a given condition.
  */
  async verifyTargetDir(dir) {
    try {
      const isGitRepo = await git(dir).checkIsRepo();

      if (isGitRepo) {
        //Need to figure out root of the repository to properly verify .gitignore
        const root = await git(dir).revparse(['--show-toplevel']);
        const gitInfo = git(root);

        //Skipping verification if workDir inside repo is declared in .gitignore
        const workDir = path.relative(root, dir);
        if (workDir) {
          const checkGitIgnore = await gitInfo.checkIgnore(workDir);
          if (checkGitIgnore.length !== 0) return;
        }

        const gitStatus = await gitInfo.status();
        //New files are not tracked and not visible as modified
        const hasUntrackedUnstagedFiles = gitStatus.not_added.length !== 0;

        const stagedFiles = gitStatus.staged;
        const modifiedFiles = gitStatus.modified;
        const hasModifiedUstagedFiles = (modifiedFiles.filter(e => stagedFiles.indexOf(e) === -1)).length !== 0;

        if (hasModifiedUstagedFiles || hasUntrackedUnstagedFiles) throw new Error(`"${this.targetDir}" is in a git repository with unstaged changes. Please commit your changes before proceeding or add proper directory to .gitignore file. You can also use the --force-write flag to skip this rule (not recommended).`);
      } else {
        const isDirEmpty = (await readDir(dir)).length === 0;

        if (!isDirEmpty) throw new Error(`"${this.targetDir}" is not an empty directory. You might override your work. To skip this rule, please make your code a git repository or use the --force-write flag (not recommended).`);
      }
    } catch (e) {
      throw e;
    }
  }
}

Generator.DEFAULT_TEMPLATES_DIR = DEFAULT_TEMPLATES_DIR;

module.exports = Generator;
