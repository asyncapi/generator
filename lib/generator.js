const path = require('path');
const fs = require('fs');
const util = require('util');
const xfs = require('fs.extra');
const walkSync = require('klaw-sync');
const _ = require('lodash');
const Markdown = require('markdown-it');
const OpenAPISampler = require('openapi-sampler');
const minimatch = require('minimatch');
const { parse, AsyncAPIDocument } = require('asyncapi-parser');
const Nunjucks = require('nunjucks');
const jmespath = require('jmespath');
const Ajv = require('ajv');
const filenamify = require('filenamify');

const ajv = new Ajv({ allErrors: true });

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);
const exists = util.promisify(fs.exists);

const FILTERS_DIRNAME = '.filters';
const PARTIALS_DIRNAME = '.partials';
const HOOKS_DIRNAME = '.hooks';
const CONFIG_FILENAME = '.tp-config.json';
const DEFAULT_TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

const shouldIgnoreFile = filePath =>
  filePath.startsWith(`${PARTIALS_DIRNAME}${path.sep}`)
  || filePath.startsWith(`${FILTERS_DIRNAME}${path.sep}`)
  || filePath.startsWith(`${HOOKS_DIRNAME}${path.sep}`)
  || path.basename(filePath) === CONFIG_FILENAME;

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
   * @example <caption>Specifying a custom directory for templates</caption>
   * const path = require('path');
   * const generator = new Generator('myTemplate', path.resolve(__dirname, 'example'), {
   *   templatesDir: path.resolve(__dirname, 'my-templates')
   * });
   *
   * @param {String} templateName  Name of the template to generate.
   * @param {String} targetDir     Path to the directory where the files will be generated.
   * @param {Object} options
   * @param {String} [options.templatesDir]     Path to the directory where to find the given template. Defaults to internal `templates` directory.
   * @param {String} [options.templateParams]   Optional parameters to pass to the template. Each template define their own params.
   * @param {String} [options.entrypoint]       Name of the file to use as the entry point for the rendering process. Note: this potentially avoids rendering every file in the template.
   * @param {String[]} [options.noOverwriteGlobs] List of globs to skip when regenerating the template.
   * @param {String[]} [options.disabledHooks] List of hooks to disable.
   * @param {String} [options.output='fs'] Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set.
   */
  constructor(templateName, targetDir, { templatesDir, templateParams, entrypoint, noOverwriteGlobs, disabledHooks, output = 'fs' } = {}) {
    if (!templateName) throw new Error('No template name has been specified.');
    if (!entrypoint && !targetDir) throw new Error('No target directory has been specified.');
    if (!['fs', 'string'].includes(output)) throw new Error(`Invalid output type ${output}. Valid values are 'fs' and 'string'.`);

    this.templateName = templateName;
    this.targetDir = targetDir;
    this.templatesDir = templatesDir || DEFAULT_TEMPLATES_DIR;
    this.templateDir = path.resolve(this.templatesDir, this.templateName);
    this.templateParams = templateParams || {};
    this.entrypoint = entrypoint;
    this.noOverwriteGlobs = noOverwriteGlobs || [];
    this.disabledHooks = disabledHooks || [];
    this.output = output;

    // Config Nunjucks
    this.nunjucks = new Nunjucks.Environment(new Nunjucks.FileSystemLoader(this.templateDir));
    this.nunjucks.addFilter('log', console.log);
    this.loadTemplateConfig();
    this.registerHooks();
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
      await this.registerFilters();

      if (this.entrypoint) {
        const entrypointPath = path.resolve(this.templateDir, this.entrypoint);
        if (!(await exists(entrypointPath))) throw new Error(`Template entrypoint "${entrypointPath}" couldn't be found.`);
        if (this.output === 'fs') {
          await this.generateFile(asyncapiDocument, path.basename(entrypointPath), path.dirname(path.relative(this.templateDir), entrypointPath));
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
   * @param  {String} [asyncApiFileLocation] AsyncAPI file location, used by the asyncapi-parser for references.
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
   * const content = await Generator.getTemplateFile('html', '.partials/content.html');
   *
   * @example <caption>Obtaining the content of a file from a custom template</caption>
   * const path = require('path');
   * const Generator = require('asyncapi-generator');
   * const content = await Generator.getTemplateFile('myTemplate', 'a/file.js', {
   *   templatesDir: path.resolve(__dirname, 'my-templates')
   * });
   *
   * @static
   * @param {String} templateName  Name of the template to generate.
   * @param {String} filePath      Path to the file to render. Relative to the template directory.
   * @param {Object} options
   * @param {String} [options.templatesDir]  Path to the directory where to find the given template. Defaults to internal `templates` directory.
   * @return {Promise}
   */
  static async getTemplateFile(templateName, filePath, { templatesDir } = {}) {
    return await readFile(path.resolve(templatesDir || DEFAULT_TEMPLATES_DIR, templateName, filePath), 'utf8');
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
            mod({
              Nunjucks: this.nunjucks,
              _,
              Markdown,
              OpenAPISampler,
            });
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

  convertMapToObject(map) {
    const tempObject = {};
    for (const [key, value] of map.entries()) {
      tempObject[key] = value;
    }
    return tempObject;
  }

  /**
   *
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
      message: this.convertMapToObject(asyncapiDocument.allMessages()),
      securityScheme: asyncapiDocument.components() ? asyncapiDocument.components().securitySchemes() : {},
      schema: this.convertMapToObject(asyncapiDocument.allSchemas()),
      parameter: this.convertMapToObject(this.getAllParameters(asyncapiDocument)),
    };

    return new Promise((resolve, reject) => {
      xfs.mkdirpSync(this.targetDir);

      const walker = xfs.walk(this.templateDir, {
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
                const templateFilePath = path.relative(this.templateDir, path.resolve(root, stats.name));
                fs.unlink(path.resolve(this.targetDir, templateFilePath), next);
                wasSeparated = true;
                //The filename can only contain 1 specifier (message, scheme etc)
                break;
              }
            }
          }
          // If it was not separated process normally
          if (!wasSeparated) {
            const filePath = path.relative(this.templateDir, path.resolve(root, stats.name));
            if (!shouldIgnoreFile(filePath)) {
              // this file should only exist once.
              await this.generateFile(asyncapiDocument, stats.name, root);
            }
            next();
          }
        } catch (e) {
          reject(e);
        }
      });

      walker.on('directory', async (root, stats, next) => {
        try {
          const dirPath = path.resolve(this.targetDir, path.relative(this.templateDir, path.resolve(root, stats.name)));
          if (
            stats.name !== PARTIALS_DIRNAME
            && stats.name !== FILTERS_DIRNAME
            && stats.name !== HOOKS_DIRNAME
          ) {
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
      const relativeBaseDir = path.relative(this.templateDir, baseDir);
      const newFileName = fileName.replace(`\$\$${template}\$\$`, filenamify(name, { replacement: '-', maxLength: 255 }));
      const targetFile = path.resolve(this.targetDir, relativeBaseDir, newFileName);
      const relativeTargetFile = path.relative(this.targetDir, targetFile);

      const shouldOverwriteFile = await this.shouldOverwriteFile(relativeTargetFile);
      if (!shouldOverwriteFile) return;
      //Ensure the same object are parsed to the renderFile method as before.
      const temp = {};
      temp[`${template}Name`] = name;
      temp[template] = component;
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
      const relativeSourceFile = path.relative(this.templateDir, sourceFile);
      const targetFile = path.resolve(this.targetDir, relativeSourceFile);
      const relativeTargetFile = path.relative(this.targetDir, targetFile);

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
   * Loads the template configuration.
   * @private
   */
  loadTemplateConfig() {
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

    this.validateTemplateConfig();
  }

  /**
   * Validates the template configuration.
   *
   * @private
   * @param  {AsyncAPIDocument} [asyncapiDocument] AsyncAPIDocument object to use as source.
   * @return {Promise}
   */
  async validateTemplateConfig(asyncapiDocument) {
    const { requiredParams, supportedProtocols, conditionalFiles } = this.templateConfig;
    let server;

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
}

module.exports = Generator;
module.exports.DEFAULT_TEMPLATES_DIR = DEFAULT_TEMPLATES_DIR;
