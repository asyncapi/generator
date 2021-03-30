const path = require('path');
const fs = require('fs');
const xfs = require('fs.extra');
const minimatch = require('minimatch');
const parser = require('@asyncapi/parser');
const { configureReact, renderReact, saveRenderedReactContent } = require('./renderer/react');
const { configureNunjucks, renderNunjucks } = require('./renderer/nunjucks');
const { parseIntents, IntentAsyncAPIDocument } = parser;
const ramlDtParser = require('@asyncapi/raml-dt-schema-parser');
const openapiSchemaParser = require('@asyncapi/openapi-schema-parser');
const avroSchemaParser = require('@asyncapi/avro-schema-parser');
const jmespath = require('jmespath');
const filenamify = require('filenamify');
const git = require('simple-git/promise');
const log = require('loglevel');
const Arborist = require('@npmcli/arborist');
const { validateTemplateConfig } = require('./templateConfigValidator');
const {
  convertMapToObject,
  isFileSystemPath,
  readFile,
  readDir,
  writeFile,
  copyFile,
  exists,
  fetchSpec,
  getInvalidOptions,
  isReactTemplate,
  isJsFile,
  registerSourceMap,
  registerTypeScript,
  getTemplateDetails
} = require('./utils');
const { registerFilters } = require('./filtersRegistry');
const { registerHooks } = require('./hooksRegistry');

const FILTERS_DIRNAME = 'filters';
const HOOKS_DIRNAME = 'hooks';
const CONFIG_FILENAME = 'package.json';
const PACKAGE_JSON_FILENAME = 'package.json';
const GIT_IGNORE_FILENAME = '{.gitignore}';
const NPM_IGNORE_FILENAME = '{.npmignore}';
const ROOT_DIR = path.resolve(__dirname, '..');
const DEFAULT_TEMPLATES_DIR = path.resolve(ROOT_DIR, 'node_modules');

const TRANSPILED_TEMPLATE_LOCATION = '__transpiled';
const TEMPLATE_CONTENT_DIRNAME = 'template';
const GENERATOR_OPTIONS = ['debug', 'disabledHooks', 'entrypoint', 'forceWrite', 'install', 'noOverwriteGlobs', 'output', 'templateParams'];

const logMessage = require('./logMessages');

const shouldIgnoreFile = filePath =>
  filePath.startsWith(`.git${path.sep}`);

const shouldIgnoreDir = dirPath =>
  dirPath === '.git'
  || dirPath.startsWith(`.git${path.sep}`);

parser.registerSchemaParser(openapiSchemaParser);
parser.registerSchemaParser(ramlDtParser);
parser.registerSchemaParser(avroSchemaParser);
registerSourceMap();
registerTypeScript();

class Generator {
  /**
   * Instantiates a new Generator object.
   *
   * @example
   * const path = require('path');
   * const generator = new Generator('@asyncapi/html-template', path.resolve(__dirname, 'example'));
   *
   * @example <caption>Passing custom params to the template</caption>
   * const path = require('path');
   * const generator = new Generator('@asyncapi/html-template', path.resolve(__dirname, 'example'), {
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
   * @param {Object<String, Boolean | String | String[]>} [options.disabledHooks] Object with hooks to disable. The key is a hook type. If key has "true" value, then the generator skips all hooks from the given type. If the value associated with a key is a string with the name of a single hook, then the generator skips only this single hook name. If the value associated with a key is an array of strings, then the generator skips only hooks from the array.
   * @param {String} [options.output='fs'] Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set.
   * @param {Boolean} [options.forceWrite=false] Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false.
   * @param {Boolean} [options.install=false] Install the template and its dependencies, even when the template has already been installed.
   * @param {Boolean} [options.debug=false] Enable more specific errors in the console. At the moment it only shows specific errors about filters. Keep in mind that as a result errors about template are less descriptive.
   */
  constructor(templateName, targetDir, { templateParams = {}, entrypoint, noOverwriteGlobs, disabledHooks, output = 'fs', forceWrite = false, install = false, debug = false } = {}) {
    const invalidOptions = getInvalidOptions(GENERATOR_OPTIONS, arguments[arguments.length - 1] || []);
    if (invalidOptions.length) throw new Error(`These options are not supported by the generator: ${invalidOptions.join(', ')}`);
    if (!templateName) throw new Error('No template name has been specified.');
    if (!entrypoint && !targetDir) throw new Error('No target directory has been specified.');
    if (!['fs', 'string'].includes(output)) throw new Error(`Invalid output type ${output}. Valid values are 'fs' and 'string'.`);

    /** @type {String} Name of the template to generate. */
    this.templateName = templateName;
    /** @type {String} Path to the directory where the files will be generated. */
    this.targetDir = targetDir;
    /** @type {String} Name of the file to use as the entry point for the rendering process. Use in case you want to use only a specific template file. Note: this potentially avoids rendering every file in the template. */
    this.entrypoint = entrypoint;
    /** @type {String[]} List of globs to skip when regenerating the template. */
    this.noOverwriteGlobs = noOverwriteGlobs || [];
    /** @type {Object<String, Boolean | String | String[]>} Object with hooks to disable. The key is a hook type. If key has "true" value, then the generator skips all hooks from the given type. If the value associated with a key is a string with the name of a single hook, then the generator skips only this single hook name. If the value associated with a key is an array of strings, then the generator skips only hooks from the array. */
    this.disabledHooks = disabledHooks || {};
    /** @type {String} Type of output. Can be either 'fs' (default) or 'string'. Only available when entrypoint is set. */
    this.output = output;
    /** @type {Boolean} Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir. Default is set to false. */
    this.forceWrite = forceWrite;
    /** @type {Boolean} Enable more specific errors in the console. At the moment it only shows specific errors about filters. Keep in mind that as a result errors about template are less descriptive. */
    this.debug = debug;
    /** @type {Boolean} Install the template and its dependencies, even when the template has already been installed. */
    this.install = install;
    /** @type {Object} The template configuration. */
    this.templateConfig = {};
    /** @type {Object} Hooks object with hooks functions grouped by the hook type. */
    this.hooks = {};

    // Load template configuration
    /** @type {Object} The template parameters. The structure for this object is based on each individual template. */
    this.templateParams = {};
    Object.keys(templateParams).forEach(key => {
      const self = this;
      Object.defineProperty(this.templateParams, key, {
        enumerable: true,
        get() {
          if (!self.templateConfig.parameters || !self.templateConfig.parameters[key]) {
            throw new Error(`Template parameter "${key}" has not been defined in the package.json file under generator property. Please make sure it's listed there before you use it in your template.`);
          }
          return templateParams[key];
        }
      });
    });
  }

  /**
   * Generates files from a given template and an IntentAsyncAPIDocument object.
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
   * @param  {IntentAsyncAPIDocument} asyncapiDocument IntentAsyncAPIDocument object to use as source.
   * @return {Promise}
   */
  async generate(asyncapiDocument) {
    if (!(asyncapiDocument instanceof IntentAsyncAPIDocument)) throw new Error('Parameter "asyncapiDocument" must be an IntentAsyncAPIDocument object.');

    if (this.output === 'fs') {
      xfs.mkdirpSync(this.targetDir);
      if (!this.forceWrite) await this.verifyTargetDir(this.targetDir);
    } else if (this.output === 'string' && this.entrypoint === undefined) {
      throw new Error('Parameter entrypoint is required when using output = "string"');
    }

    if (this.debug) log.setLevel('debug');
    const { name: templatePkgName, path: templatePkgPath } = await this.installTemplate(this.install);
    this.templateDir = templatePkgPath;
    this.templateName = templatePkgName;
    this.templateContentDir = path.resolve(this.templateDir, TEMPLATE_CONTENT_DIRNAME);
    await this.loadTemplateConfig();
    validateTemplateConfig(this.templateConfig, this.templateParams, asyncapiDocument);
    await this.configureTemplate();

    if (!isReactTemplate(this.templateConfig)) {
      await registerFilters(this.nunjucks, this.templateConfig, this.templateDir, FILTERS_DIRNAME);
    }
    await registerHooks(this.hooks, this.templateConfig, this.templateDir, HOOKS_DIRNAME);
    await this.launchHook('generate:before');

    if (this.entrypoint) {
      const entrypointPath = path.resolve(this.templateContentDir, this.entrypoint);
      if (!(await exists(entrypointPath))) throw new Error(`Template entrypoint "${entrypointPath}" couldn't be found.`);
      if (this.output === 'fs') {
        await this.generateFile(asyncapiDocument, path.basename(entrypointPath), path.dirname(entrypointPath));
        await this.launchHook('generate:after');
      } else if (this.output === 'string') {
        return this.renderFile(asyncapiDocument, entrypointPath);
      }
    } else {
      await this.generateDirectoryStructure(asyncapiDocument);
      await this.launchHook('generate:after');
    }
  }

  /**
   * Configure the templates based the desired renderer.
   */
  async configureTemplate() {
    if (isReactTemplate(this.templateConfig)) {
      await configureReact(this.templateDir, this.templateContentDir, TRANSPILED_TEMPLATE_LOCATION);
    } else {
      this.nunjucks = configureNunjucks(this.debug, this.templateDir);
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
   * @param  {Object} [parserOptions={}] AsyncAPI parser options. Check out {@link https://www.github.com/asyncapi/parser-js|@asyncapi/parser} for more information.
   * @return {Promise}
   */
  async generateFromString(asyncapiString, parserOptions = {}) {
    if (!asyncapiString || typeof asyncapiString !== 'string') throw new Error('Parameter "asyncapiString" must be a non-empty string.');

    /** @type {String} AsyncAPI string to use as a source. */
    this.originalAsyncAPI = asyncapiString;

    /** @type {IntentAsyncAPIDocument} Parsed AsyncAPI schema. See {@link https://github.com/asyncapi/parser-js/blob/master/API.md#module_@asyncapi/parser+IntentAsyncAPIDocument|IntentAsyncAPIDocument} for details on object structure. */
    this.asyncapi = await parseIntents(asyncapiString, parserOptions);
    return this.generate(this.asyncapi);
  }

  /**
   * Generates files from a given template and AsyncAPI file stored on external server.
   *
   * @example
   * generator
   *   .generateFromURL('https://example.com/asyncapi.yaml')
   *   .then(() => {
   *     console.log('Done!');
   *   })
   *   .catch(console.error);
   *
   * @example <caption>Using async/await</caption>
   * try {
   *   await generator.generateFromURL('https://example.com/asyncapi.yaml');
   *   console.log('Done!');
   * } catch (e) {
   *   console.error(e);
   * }
   *
   * @param  {String} asyncapiURL Link to AsyncAPI file
   * @return {Promise}
   */
  async generateFromURL(asyncapiURL) {
    const doc = await fetchSpec(asyncapiURL);

    return this.generateFromString(doc);
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
    const doc = await readFile(asyncapiFile, { encoding: 'utf8' });
    return this.generateFromString(doc, { path: asyncapiFile });
  }

  /**
   * Returns the content of a given template file.
   *
   * @example
   * const Generator = require('asyncapi-generator');
   * const content = await Generator.getTemplateFile('@asyncapi/html-template', 'partials/content.html');
   *
   * @example <caption>Using a custom `templatesDir`</caption>
   * const Generator = require('asyncapi-generator');
   * const content = await Generator.getTemplateFile('@asyncapi/html-template', 'partials/content.html', '~/my-templates');
   *
   * @static
   * @param {String} templateName  Name of the template to generate.
   * @param {String} filePath      Path to the file to render. Relative to the template directory.
   * @param {String} [templatesDir=DEFAULT_TEMPLATES_DIR] Path to the directory where the templates are installed.
   * @return {Promise}
   */
  static async getTemplateFile(templateName, filePath, templatesDir = DEFAULT_TEMPLATES_DIR) {
    return await readFile(path.resolve(templatesDir, templateName, filePath), 'utf8');
  }

  /**
   * Downloads and installs a template and its dependencies
   *
   * @param {Boolean} [force=false] Whether to force installation (and skip cache) or not.
   */
  installTemplate(force = false) {
    return new Promise(async (resolve, reject) => {
      if (!force) {
        let pkgPath;
        let installedPkg;
        let packageVersion;

        try {
          installedPkg = getTemplateDetails(this.templateName, PACKAGE_JSON_FILENAME);
          pkgPath = installedPkg && installedPkg.pkgPath;
          packageVersion = installedPkg && installedPkg.version;
          log.debug(logMessage.templateSource(pkgPath));
          if (packageVersion) log.debug(logMessage.templateVersion(packageVersion));

          return resolve({
            name: installedPkg.name,
            path: pkgPath
          });
        } catch (e) {
          log.debug(logMessage.packageNotAvailable(pkgPath), e);
          // We did our best. Proceed with installation...
        }
      }

      const debugMessage = force ? logMessage.TEMPLATE_INSTALL_FLAG_MSG : logMessage.TEMPLATE_INSTALL_DISK_MSG;
      log.debug(logMessage.installationDebugMessage(debugMessage));

      if (isFileSystemPath(this.templateName)) log.debug(logMessage.NPM_INSTALL_TRIGGER);

      const arb = new Arborist({
        path: ROOT_DIR
      });

      try {
        const installResult = await arb.reify({
          add: [this.templateName],
          saveType: 'prod',
          save: false
        });

        const addResult = arb[Symbol.for('resolvedAdd')];
        if (!addResult) return reject('Unable to resolve the name of the added package. It was most probably not added to node_modules successfully');

        const packageName = addResult[0].name;
        const packageVersion = installResult.children.get(packageName).version;
        const packagePath = installResult.children.get(packageName).path;

        if (!isFileSystemPath(this.templateName)) log.debug(logMessage.templateSuccessfullyInstalled(packageName, packagePath));
        if (packageVersion) log.debug(logMessage.templateVersion(packageVersion));

        return resolve({
          name: packageName,
          path: packagePath,
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generates the directory structure.
   *
   * @private
   * @param  {IntentAsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @return {Promise}
   */
  generateDirectoryStructure(asyncapiDocument) {
    const objectMap = asyncapiDocument.schemas() ? asyncapiDocument.schemas().reduce((map, schema) => { if (schema.type() === 'object') map[schema.uid()] = schema; }, {}) : {};

    return new Promise((resolve, reject) => {
      xfs.mkdirpSync(this.targetDir);

      const walker = xfs.walk(this.templateContentDir, {
        followLinks: false
      });

      walker.on('file', async (root, stats, next) => {
        try {
          await this.filesGenerationHandler(asyncapiDocument, objectMap, root, stats, next);
        } catch (e) {
          reject(e);
        }
      });

      walker.on('directory', async (root, stats, next) => {
        try {
          this.ignoredDirHandler(root, stats, next);
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
   * Makes sure that during directory structure generation ignored dirs are not modified
   * @private
   * 
   * @param  {String} root Dir name.
   * @param  {String} stats Information about the file.
   * @param  {Function} next Callback function
   */
  ignoredDirHandler(root, stats, next) {
    const relativeDir = path.relative(this.templateContentDir, path.resolve(root, stats.name));
    const dirPath = path.resolve(this.targetDir, relativeDir);
    if (!shouldIgnoreDir(relativeDir)) {
      xfs.mkdirpSync(dirPath);
    }
    next();
  }

  /**
   * Makes sure that during directory structure generation ignored dirs are not modified
   * @private
   * 
   * @param  {IntentAsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param  {String} objectMap Map of schemas of type object
   * @param  {String} root Dir name.
   * @param  {String} stats Information about the file.
   * @param  {Function} next Callback function
   */
  async filesGenerationHandler(asyncapiDocument, objectMap, root, stats, next) {
    const fileNamesForSeparation = {
      channel: asyncapiDocument.channels() ? asyncapiDocument.channels().reduce((map, channel) => {
        map[channel.path()] = channel;
        return map;
      }, {}) : {},
      message: asyncapiDocument.messages('client') ? asyncapiDocument.messages('client').reduce((map, message) => {
        map[message.uid()] = message;
        return map;
      }, {}) : {},
      securityScheme: asyncapiDocument.securitySchemes() ? asyncapiDocument.securitySchemes().reduce((map, scheme) => {
        map[scheme.name()] = scheme;
        return map;
      }, {}) : {},
      objectSchema: objectMap,
      parameter: asyncapiDocument.parameters() ? asyncapiDocument.parameters().reduce((map, param) => {
        map[param.uid()] = param;
        return map;
      }, {}) : {},
      schemas: asyncapiDocument.schemas() ? asyncapiDocument.schemas().reduce((map, schema) => {
        map[schema.uid()] = schema;
        return map;
      }, {}) : {},
    };

    // Check if the filename dictates it should be separated
    let wasSeparated = false;
    for (const prop in fileNamesForSeparation) {
      if (Object.prototype.hasOwnProperty.call(fileNamesForSeparation, prop) && stats.name.includes(`$$${prop}$$`)) {
        await this.generateSeparateFiles(asyncapiDocument, fileNamesForSeparation[prop], prop, stats.name, root);
        const templateFilePath = path.relative(this.templateContentDir, path.resolve(root, stats.name));
        fs.unlink(path.resolve(this.targetDir, templateFilePath), next);
        wasSeparated = true;
        //The filename can only contain 1 specifier (message, scheme etc)
        break;
      }
    }
    // If it was not separated process normally
    if (!wasSeparated) {
      await this.generateFile(asyncapiDocument, stats.name, root);
      next();
    }
  }

  /**
   * Generates all the files for each in array
   *
   * @private
   * @param  {IntentAsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
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
   * @param  {IntentAsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param  {String} name The name of the component (filename to use)
   * @param  {Object} component The component/channel object used to generate the file.
   * @param  {String} template The template filename to replace.
   * @param  {String} fileName Name of the file to generate for each security schema.
   * @param  {String} baseDir Base directory of the given file name.
   * @returns {Promise}
   */
  async generateSeparateFile(asyncapiDocument, name, component, template, fileName, baseDir) {
    const relativeBaseDir = path.relative(this.templateContentDir, baseDir);

    const setFileTemplateNameHookName = 'setFileTemplateName';
    let filename = name;
    if (this.isHookAvailable(setFileTemplateNameHookName)) {
      const filenamesFromHooks = await this.launchHook(setFileTemplateNameHookName, { originalFilename: filename });
      //Use the result of the first hook
      filename = filenamesFromHooks[0];
    } else {
      filename = filenamify(filename, { replacement: '-', maxLength: 255 });
    }

    const newFileName = fileName.replace(`\$\$${template}\$\$`, filename);
    const targetFile = path.resolve(this.targetDir, relativeBaseDir, newFileName);
    const relativeTargetFile = path.relative(this.targetDir, targetFile);
    const shouldOverwriteFile = this.shouldOverwriteFile(relativeTargetFile);
    if (!shouldOverwriteFile) return;
    //Ensure the same object are parsed to the renderFile method as before.
    const temp = {};
    const key = template === 'everySchema' || template === 'objectSchema' ? 'schema' : template;
    temp[`${key}Name`] = name;
    temp[key] = component;
    await this.renderAndWriteToFile(asyncapiDocument, path.resolve(baseDir, fileName), targetFile, temp);
  }

  /**
   * Renders a template and writes the result into a file.
   * 
   * @private
   * @param {IntentAsyncAPIDocument} asyncapiDocument AsyncAPI document to pass to the template.
   * @param {String} templateFilePath Path to the input file being rendered.
   * @param {String} outputPath Path to the resulting rendered file.
   * @param {Object} [extraTemplateData] Extra data to pass to the template.
   */
  async renderAndWriteToFile(asyncapiDocument, templateFilePath, outputpath, extraTemplateData) {
    const renderContent = await this.renderFile(asyncapiDocument, templateFilePath, extraTemplateData);
    if (renderContent === undefined) {
      return;
    } else if (isReactTemplate(this.templateConfig)) {
      await saveRenderedReactContent(renderContent, outputpath);
    } else {
      await writeFile(outputpath, renderContent);
    }
  }

  /**
   * Generates a file.
   *
   * @private
   * @param {IntentAsyncAPIDocument} asyncapiDocument AsyncAPI document to use as the source.
   * @param {String} fileName Name of the file to generate for each channel.
   * @param {String} baseDir Base directory of the given file name.
   * @return {Promise}
   */
  async generateFile(asyncapiDocument, fileName, baseDir) {
    const sourceFile = path.resolve(baseDir, fileName);
    const relativeSourceFile = path.relative(this.templateContentDir, sourceFile);
    const targetFile = path.resolve(this.targetDir, this.maybeRenameSourceFile(relativeSourceFile));
    const relativeTargetFile = path.relative(this.targetDir, targetFile);

    if (shouldIgnoreFile(relativeSourceFile)) return;

    const shouldOverwriteFile = this.shouldOverwriteFile(relativeTargetFile);
    if (!shouldOverwriteFile) return;

    if (this.templateConfig.conditionalFiles && this.templateConfig.conditionalFiles[relativeSourceFile]) {
      const server = this.templateParams.server && asyncapiDocument.server(this.templateParams.server);
      const source = jmespath.search({
        ...asyncapiDocument.json(),
        ...{
          server: server ? server.json() : undefined,
        },
      }, this.templateConfig.conditionalFiles[relativeSourceFile].subject);

      if (!source) return log.debug(logMessage.relativeSourceFileNotGenerated(relativeSourceFile, this.templateConfig.conditionalFiles[relativeSourceFile].subject));

      if (source) {
        const validate = this.templateConfig.conditionalFiles[relativeSourceFile].validate;
        const valid = validate(source);
        if (!valid) return log.debug(logMessage.conditionalFilesMatched(relativeSourceFile));
      }
    }

    if (this.isNonRenderableFile(relativeSourceFile)) return await copyFile(sourceFile, targetFile);

    await this.renderAndWriteToFile(asyncapiDocument, sourceFile, targetFile);
  }

  /**
   * It may rename the source file name in cases where special names are not supported, like .gitignore or .npmignore.
   *
   * Since we're using npm to install templates, these files are never downloaded (that's npm behavior we can't change).
   * @private
   * @param {String} sourceFile Path to the source file
   * @returns {String} New path name
   */
  maybeRenameSourceFile(sourceFile) {
    switch (path.basename(sourceFile)) {
    case GIT_IGNORE_FILENAME:
      return path.join(path.dirname(sourceFile), '.gitignore');
    case NPM_IGNORE_FILENAME:
      return path.join(path.dirname(sourceFile), '.npmignore');
    default:
      return sourceFile;
    }
  }

  /**
   * Renders the content of a file and outputs it.
   *
   * @private
   * @param {IntentAsyncAPIDocument} asyncapiDocument AsyncAPI document to pass to the template.
   * @param {String} filePath Path to the file you want to render.
   * @param {Object} [extraTemplateData] Extra data to pass to the template.
   * @return {Promise<string|TemplateRenderResult|Array<TemplateRenderResult>|undefined>}
   */
  async renderFile(asyncapiDocument, filePath, extraTemplateData = {}) {
    if (isReactTemplate(this.templateConfig)) {
      return await renderReact(asyncapiDocument, filePath, extraTemplateData, this.templateDir, this.templateContentDir, TRANSPILED_TEMPLATE_LOCATION, this.templateParams, this.debug, this.originalAsyncAPI);
    }
    const templateString = await readFile(filePath, 'utf8');
    return renderNunjucks(asyncapiDocument, templateString, filePath, extraTemplateData, this.templateParams, this.originalAsyncAPI, this.nunjucks);
  }

  /**
   * Checks if a given file name matches the list of non-renderable files.
   *
   * @private
   * @param  {string} fileName Name of the file to check against a list of glob patterns.
   * @return {boolean}
   */
  isNonRenderableFile(fileName) {
    const nonRenderableFiles = this.templateConfig.nonRenderableFiles || [];
    if (!Array.isArray(nonRenderableFiles)) return false;
    if (nonRenderableFiles.some(globExp => minimatch(fileName, globExp))) return true;
    if (isReactTemplate(this.templateConfig) && !isJsFile(fileName)) return true;
    return false;
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
  async loadTemplateConfig() {
    try {
      const configPath = path.resolve(this.templateDir, CONFIG_FILENAME);
      if (!fs.existsSync(configPath)) {
        this.templateConfig = {};
        return;
      }

      const json = await readFile(configPath, { encoding: 'utf8' });
      const generatorProp = JSON.parse(json).generator;
      this.templateConfig = generatorProp || {};
    } catch (e) {
      this.templateConfig = {};
    }
    await this.loadDefaultValues();
  }

  /**
   * Loads default values of parameters from template config. If value was already set as parameter it will not be
   * overriden.
   * @private
   */
  async loadDefaultValues() {
    const parameters = this.templateConfig.parameters;
    const defaultValues = Object.keys(parameters || {}).filter(key => parameters[key].default);

    defaultValues.filter(dv => this.templateParams[dv] === undefined).forEach(dv =>
      Object.defineProperty(this.templateParams, dv, {
        enumerable: true,
        get() {
          return parameters[dv].default;
        }
      })
    );
  }

  /**
   * Launches all the hooks registered at a given hook point/name.
   *
   * @param {string} hookName
   * @param {*} hookArguments
   * @private
   */
  async launchHook(hookName, hookArguments) {
    let disabledHooks = this.disabledHooks[hookName] || [];
    if (disabledHooks === true) return;
    if (typeof disabledHooks === 'string') disabledHooks = [disabledHooks];

    const hooks = this.hooks[hookName];
    if (!Array.isArray(hooks)) return;
    const promises = hooks.map(async (hook) => {
      if (typeof hook !== 'function') return;
      if (disabledHooks.includes(hook.name)) return;
      return await hook(this, hookArguments);
    }).filter(Boolean);

    return Promise.all(promises);
  }

  /**
   * Check if any hooks are available
   *
   * @param {string} hookName
   * @private
   */
  isHookAvailable(hookName) {
    const hooks = this.hooks[hookName];

    if (this.disabledHooks[hookName] === true
      || !Array.isArray(hooks)
      || hooks.length === 0) return false;

    let disabledHooks = this.disabledHooks[hookName] || [];
    if (typeof disabledHooks === 'string') disabledHooks = [disabledHooks];

    return !!hooks.filter(h => !disabledHooks.includes(h.name)).length;
  }

  /**
   * Check if given directory is a git repo with unstaged changes and is not in .gitignore or is not empty
   * @private
   * @param  {String} dir Directory that needs to be tested for a given condition.
  */
  async verifyTargetDir(dir) {
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
  }
}

Generator.DEFAULT_TEMPLATES_DIR = DEFAULT_TEMPLATES_DIR;
Generator.TRANSPILED_TEMPLATE_LOCATION = TRANSPILED_TEMPLATE_LOCATION;

module.exports = Generator;
