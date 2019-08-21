const path = require('path');
const fs = require('fs');
const util = require('util');
const xfs = require('fs.extra');
const _ = require('lodash');
const Markdown = require('markdown-it');
const OpenAPISampler = require('openapi-sampler');
const minimatch = require('minimatch');
const { parse, AsyncAPIDocument } = require('asyncapi-parser');
const Nunjucks = require('nunjucks');
const jmespath = require('jmespath');
const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const copyFile = util.promisify(fs.copyFile);
const exists = util.promisify(fs.exists);

const FILTERS_DIRNAME = '.filters';
const PARTIALS_DIRNAME = '.partials';
const CONFIG_FILENAME = '.tp-config.json';
const DEFAULT_TEMPLATES_DIR = path.resolve(__dirname, '..', 'templates');

const shouldIgnoreFile = filePath =>
  filePath.startsWith(`${PARTIALS_DIRNAME}${path.sep}`)
  || filePath.startsWith(`${FILTERS_DIRNAME}${path.sep}`)
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
   * @param {String} [options.templatesDir]    Path to the directory where to find the given template. Defaults to internal `templates` directory.
   * @param {String} [options.templateParams]  Optional parameters to pass to the template. Each template define their own params.
   * @param {String} [options.entrypoint]      Name of the file to use as the entry point for the rendering process. Note: this potentially avoids rendering every file in the template.
   */
  constructor(templateName, targetDir, { templatesDir, templateParams, entrypoint }) {
    if (!templateName) throw new Error('No template name has been specified.');
    if (!entrypoint && !targetDir) throw new Error('No target directory has been specified.');

    this.templateName = templateName;
    this.targetDir = targetDir;
    if (!templatesDir) this.templatesDir = DEFAULT_TEMPLATES_DIR;
    this.templateDir = path.resolve(this.templatesDir, this.templateName);
    this.templateParams = templateParams || {};
    this.entrypoint = entrypoint;

    // Config Nunjucks
    this.nunjucks = new Nunjucks.Environment(new Nunjucks.FileSystemLoader(this.templateDir));
    this.nunjucks.addFilter('log', console.log);
    this.registerFilters();
    this.loadTemplateConfig();
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
      if (this.entrypoint) {
        if (!(await exists(this.entrypoint))) throw new Error(`Template entrypoint "${this.entrypoint}" couldn't be found.`);
        await this.renderFile(asyncapiDocument, path.relative(this.templateDir, this.entrypoint));
        return;
      }
      await this.validateTemplateConfig(asyncapiDocument);
      await this.generateDirectoryStructure(asyncapiDocument);
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
   * @return {Promise}
   */
  async generateFromString(asyncapiString) {
    if (!asyncapiString || typeof asyncapiString !== 'string') throw new Error('Parameter "asyncapiString" must be a non-empty string.');

    try {
      const parsed = await parse(asyncapiString);
      await this.generate(parsed);
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
      await this.generateFromString(doc);
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
  static async getTemplateFile (templateName, filePath, { templatesDir }) {
    return await readFile(path.relative(templatesDir || DEFAULT_TEMPLATES_DIR, path.resolve(templateName, filePath)), 'utf8');
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

  /**
   * Generates the directory structure.
   *
   * @private
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @return {Promise}
   */
  generateDirectoryStructure(asyncapiDocument) {
    return new Promise((resolve, reject) => {
      xfs.mkdirpSync(this.targetDir);

      const walker = xfs.walk(this.templateDir, {
        followLinks: false
      });

      walker.on('file', async (root, stats, next) => {
        try {
          if (stats.name.includes('$$channel$$')) {
            // this file should be handled for each in asyncapi.channels
            await this.generateChannelFiles(asyncapiDocument, stats.name, root);
            const templateFilePath = path.relative(this.templateDir, path.resolve(root, stats.name));
            fs.unlink(path.resolve(this.targetDir, templateFilePath), next);
          } else {
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
          if (stats.name !== PARTIALS_DIRNAME && stats.name !== FILTERS_DIRNAME) xfs.mkdirpSync(dirPath);
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
   * Generates all the files for each channel.
   *
   * @private
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param  {String} fileName Name of the file to generate for each channel.
   * @param  {String} baseDir Base directory of the given file name.
   * @returns {Promise}
   */
  async generateChannelFiles(asyncapiDocument, fileName, baseDir) {
    const promises = [];

    asyncapiDocument.channelNames().forEach((channelName) => {
      promises.push(this.generateChannelFile(asyncapiDocument, channelName, fileName, baseDir));
    });

    return Promise.all(promises);
  }

  /**
   * Generates a file for a channel.
   *
   * @private
   * @param {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param {String} channelName Name of the channel to generate.
   * @param {String} fileName Name of the file to generate for each channel.
   * @param {String} baseDir Base directory of the given file name.
   * @returns {Promise}
   */
  async generateChannelFile(asyncapiDocument, channelName, fileName, baseDir) {
    try {
      const relativeBaseDir = path.relative(this.templateDir, baseDir);
      const newFileName = fileName.replace('$$channel$$', _.kebabCase(channelName));
      const targetFile = path.resolve(this.targetDir, relativeBaseDir, newFileName);
      const content = await this.renderFile(asyncapiDocument, path.resolve(baseDir, fileName), {
        channelName,
        channel: asyncapiDocument.channel(channelName),
      });

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

      if (this.isNonRenderableFile(relativeSourceFile)) {
        return await copyFile(sourceFile, targetFile);
      }

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
      return this.nunjucks.renderString(content, {
        asyncapi: asyncapiDocument,
        params: this.templateParams,
        ...extraTemplateData,
      });
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

    return this.templateConfig.nonRenderableFiles.some((globExp) => {
      return minimatch(fileName, globExp);
    });
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
}

module.exports = Generator;
