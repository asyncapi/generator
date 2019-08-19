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

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const FILTERS_DIRNAME = '.filters';
const PARTIALS_DIRNAME = '.partials';
const CONFIG_FILENAME = '.tp-config';

const shouldIgnoreFile = filePath =>
  filePath.startsWith(`${PARTIALS_DIRNAME}${path.sep}`)
  || filePath.startsWith(`${FILTERS_DIRNAME}${path.sep}`)
  || path.basename(filePath) === CONFIG_FILENAME;

class Generator {
  /**
   * Instantiates a new Generator object.
   *
   * @param {String} templateName     Name of the template to generate.
   * @param {String} targetDir        Path to the directory where the files will be generated.
   * @param {Object} options
   * @param {String} templatesDir     Path to the directory where to find the given template. Defaults to internal `templates` directory.
   */
  constructor(templateName, targetDir, { templatesDir }) {
    if (!templateName) throw new Error('No template name has been specified.');
    if (!targetDir) throw new Error('No target directory has been specified.');

    this.templateName = templateName;
    this.targetDir = targetDir;
    if (!templatesDir) this.templatesDir = path.resolve(__dirname, '..', 'templates');
    this.templateDir = path.resolve(this.templatesDir, this.templateName);

    // Config Nunjucks
    this.nunjucks = new Nunjucks.Environment(new Nunjucks.FileSystemLoader(this.templateDir));
    this.nunjucks.addFilter('log', console.log);
    this.registerFilters();
    this.loadTemplateConfig();
  }

  /**
   * Generates files from a given template and an AsyncAPIDocument object.
   *
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPIDocument object to use as source.
   * @return {Promise}
   */
  async generate(asyncapiDocument) {
    if (!(asyncapiDocument instanceof AsyncAPIDocument)) throw new Error('Parameter "asyncapiDocument" must be an AsyncAPIDocument object.');

    try {
      await this.generateDirectoryStructure(asyncapiDocument);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Generates files from a given template and AsyncAPI string.
   *
   * @param  {String} asyncapiString AsyncAPI string to use as source.
   * @return {Promise}
   */
  async generateFromString(asyncapiString) {
    if (!asyncapiString || typeof asyncapiString !== 'string') throw new Error('Parameter "asyncapiString" must be a non-empty string.');

    try {
      const parsed = await parse(asyncapiString);
      this.generate(parsed);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Generates files from a given template and AsyncAPI file.
   *
   * @param  {String} asyncapiFile AsyncAPI file to use as source.
   * @return {Promise}
   */
  async generateFromFile(asyncapiFile) {
    try {
      const doc = await readFile(asyncapiFile, { encoding: 'utf8' });
      this.generateFromString(doc);
    } catch (e) {
      throw e;
    }
  }

  /**
   * Generates a given template file.
   *
   * @param  {AsyncAPIDocument} asyncapiDocument AsyncAPI document to pass to the template.
   * @param  {String} filePath         Path to the file to render. Relative to the template directory.
   * @return {Promise}
   */
  async generateTemplateFile(asyncapiDocument, filePath) {
    return await this.renderFile(asyncapiDocument, path.relative(this.templateDir, filePath));
  }

  /**
   * Returns the content of a given template file.
   *
   * @param  {String} filePath Path to the file to render. Relative to the template directory.
   * @return {Promise}
   */
  async getTemplateFile(filePath) {
    return await readFile(path.relative(this.templatesDir, filePath), 'utf8');
  }

  /**
   * Registers the template filters.
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
            await this.generateChannelFiles(asyncapiDocument, root);
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
   * @param {AsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param {String} channelName Name of the channel to generate.
   * @param {String} fileName Name of the file to generate for each channel.
   * @param {String} baseDir Base directory of the given file name.
   * @returns {Promise}
   */
  async generateChannelFile(asyncapiDocument, channelName, fileName, baseDir) {
    try {
      const data = await readFile(path.resolve(baseDir, fileName), 'utf8');
      const relativeBaseDir = path.relative(this.templateDir, baseDir);
      const newFileName = fileName.replace('$$channel$$', channelName);
      const targetFile = path.resolve(this.targetDir, relativeBaseDir, newFileName);
      const content = this.nunjucks.renderString(data.toString(), {
        asyncapi: asyncapiDocument
      });

      await writeFile(targetFile, content, 'utf8');
    } catch (e) {
      throw e;
    }
  }

  /**
   * Generates a file.
   *
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

      if (this.isFileNonRenderable(fileName)) {
        await fs.copyFile(sourceFile, targetFile);
      } else {
        const parsedContent = await this.renderFile(asyncapiDocument, sourceFile);
        const stats = fs.statSync(sourceFile);

        await writeFile(targetFile, parsedContent, { encoding: 'utf8', mode: stats.mode });
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Renders the content of a file and outputs it.
   *
   * @param {AsyncAPIDocument} asyncapiDocument AsyncAPI document to pass to the template.
   * @param {String} filePath Path to the file you want to render.
   * @return {Promise}
   */
  async renderFile(asyncapiDocument, filePath) {
    try {
      const content = await readFile(filePath, 'utf8');
      return this.nunjucks.renderString(content, {
        asyncapi: asyncapiDocument
      });
    } catch (e) {
      throw e;
    }
  }

  /**
   * Checks if a given file name matches the list of non-renderable files.
   *
   * @param  {string} fileName Name of the file to check against a list of glob patterns.
   * @return {boolean}
   */
  isFileNonRenderable(fileName) {
    if (!Array.isArray(this.templateConfig.nonRenderableFiles)) return false;

    return this.templateConfig.nonRenderableFiles.some((globExp) => {
      return minimatch(fileName, globExp);
    });
  }

  /**
   * Loads the template configuration.
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
  }
}

module.exports = Generator;
