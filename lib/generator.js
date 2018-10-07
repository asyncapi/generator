const os = require('os');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');
const _ = require('lodash');
const randomName = require('project-name-generator');
const xfs = require('fs.extra');
const beautifier = require('./beautifier');
const registerPartial = require('./register-partial');
const parse = require('./parser');

const generator = module.exports;

const HELPERS_DIRNAME = '.helpers';
const PARTIALS_DIRNAME = '.partials';

/**
 * Renders the content of a file and outputs it.
 *
 * @private
 * @param  {String} filePath  Path to the file you want to render.
 * @param  {String} data      Data to pass the template during rendering.
 * @return {Promise}
 */
const renderFile = (filePath, data) => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) return reject(err);

    try {
      const template = Handlebars.compile(content);
      const parsed_content = template(data);
      resolve(parsed_content);
    } catch (e) {
      reject(e);
    }
  });
});

/**
 * Generates a file.
 *
 * @private
 * @param  {Object} options
 * @param  {String} options.templates_dir Directory where the templates live.
 * @param  {String} options.target_dir    Directory where the file will be generated.
 * @param  {String} options.file_name     Name of the generated file.
 * @param  {String} options.root          Root directory.
 * @param  {Object} options.data          Data to pass to the template.
 * @return {Promise}
 */
const generateFile = options => new Promise((resolve, reject) => {
  const templates_dir = options.templates_dir;
  const target_dir = options.target_dir;
  const file_name = options.file_name;
  const root = options.root;
  const data = options.data;

  renderFile(path.resolve(root, file_name), data)
    .then((parsed_content) => {
      const template_path = path.relative(templates_dir, path.resolve(root, file_name));
      const generated_path = path.resolve(target_dir, template_path);

      fs.writeFile(generated_path, parsed_content, 'utf8', (err) => {
        if (err) return reject(err);
        resolve();
      });
    })
    .catch(reject);
});

/**
 * Generates a file for every topic.
 *
 * @param config
 * @param topic
 * @param topicName
 * @returns {Promise}
 */
const generateTopicFile = (config, topic, topicName) => new Promise((resolve, reject) => {
  fs.readFile(path.join(config.root, config.file_name), 'utf8', (err, data) => {
    if (err) return reject(err);
    const subdir = config.root.replace(new RegExp(`${config.templates_dir}[/]?`),'');
    const new_filename = config.file_name.replace('$$topic$$', topicName);
    const target_file = path.resolve(config.target_dir, subdir, new_filename);
    const template = Handlebars.compile(data.toString());
    const content = template({
      openbrace: '{',
      closebrace: '}' ,
      topicName: topicName.replace(/[}{]/g, ''),
      topic,
      asyncapi: config.data.asyncapi
    });

    fs.writeFile(target_file, content, 'utf8', (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
});

/**
 * Generates all the files for each topic.
 *
 * @param   {Object}  config Configuration options
 * @returns {Promise}
 */
const generateTopicFiles = options => new Promise((resolve, reject) => {
  let shouldResolve = true;

  _.each(options.data.asyncapi.topics, (topic, topicName) => {
    generateTopicFile(options, topic, topicName).catch((err) => {
      shouldResolve = false;
      reject(err);
    });
  });

  if (shouldResolve) resolve();
});

/**
 * Generates the directory structure.
 *
 * @private
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.asyncapi AsyncAPI JSON or a string pointing to a AsyncAPI file.
 * @param  {String}        config.target_dir Absolute path to the directory where the files will be generated.
 * @param  {String}        config.templates Absolute path to the templates that should be used.
 * @return {Promise}
 */
const generateDirectoryStructure = config => new Promise((resolve, reject) => {
  const target_dir = config.target_dir;
  const templates_dir = config.templates;

  xfs.mkdirpSync(target_dir);

  const walker = xfs.walk(templates_dir, {
    followLinks: false
  });

  walker.on('file', async (root, stats, next) => {
    try {
      if (stats.name.includes('$$topic$$')) {
        // this file should be handled for each in asyncapi.paths
        await generateTopicFiles({
          root,
          templates_dir,
          target_dir,
          data: config,
          file_name: stats.name
        });
        const template_path = path.relative(templates_dir, path.resolve(root, stats.name));
        fs.unlink(path.resolve(target_dir, template_path), next);
      } else {
        const file_path = path.relative(templates_dir, path.resolve(root, stats.name));
        if (!file_path.startsWith(`${PARTIALS_DIRNAME}${path.sep}`) && !file_path.startsWith(`${HELPERS_DIRNAME}${path.sep}`)) {
          // this file should only exist once.
          await generateFile({
            root,
            templates_dir,
            target_dir,
            data: config,
            file_name: stats.name
          });
        }
        next();
      }
    } catch (e) {
      reject(e);
    }
  });

  walker.on('directory', async (root, stats, next) => {
    try {
      const dir_path = path.resolve(target_dir, path.relative(templates_dir, path.resolve(root, stats.name)));
      if (stats.name !== PARTIALS_DIRNAME && stats.name !== HELPERS_DIRNAME) xfs.mkdirpSync(dir_path);
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

/**
 * Register the template partials
 *
 * @private
 * @param  {Object}   config Configuration options
 * @param  {String}   config.templates Absolute path to the templates that should be used.
 * @return {Promise}
 */
const registerHelpers = config => new Promise((resolve, reject) => {
  const helpers_dir = path.resolve(config.templates, HELPERS_DIRNAME);

  if (!fs.existsSync(helpers_dir)) return resolve();

  const walker = xfs.walk(helpers_dir, {
    followLinks: false
  });

  walker.on('file', async (root, stats, next) => {
    try {
      const file_path = path.resolve(config.templates, path.resolve(root, stats.name));
      // If it's a module constructor, inject dependencies to ensure consistent usage in remote templates in other projects or plain directories.
      const mod = require(file_path);
      if (typeof mod === 'function') mod(Handlebars, _);
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

/**
 * Register the template helpers
 *
 * @private
 * @param  {Object}   config Configuration options
 * @param  {String}   config.templates Absolute path to the templates that should be used.
 * @return {Promise}
 */
const registerPartials = config => new Promise((resolve, reject) => {
  const partials_dir = path.resolve(config.templates, PARTIALS_DIRNAME);

  if (!fs.existsSync(partials_dir)) return resolve();

  const walker = xfs.walk(partials_dir, {
    followLinks: false
  });

  walker.on('file', async (root, stats, next) => {
    try {
      const file_path = path.resolve(config.templates, path.resolve(root, stats.name));
      await registerPartial(file_path);
      next();
    } catch (e) {
      reject(e);
    }
  });

  walker.on('errors', (root, nodeStatsArray) => {
    reject(nodeStatsArray);
  });

  walker.on('end', () => {
    resolve();
  });
});

const bundleAndApplyDefaults = config => new Promise((resolve, reject) => {
  parse(config.asyncapi)
    .then((asyncapi) => {
      config.asyncapi = beautifier(asyncapi);
      const random_name = randomName().dashed;

      if (!config.template) {
        return reject(new Error('No template has been specified.'));
      }

      _.defaultsDeep(config, {
        asyncapi: {
          info: {
            title: random_name
          }
        },
        package: {
          name: _.kebabCase(_.result(config, 'asyncapi.info.title', random_name))
        },
        target_dir: path.resolve(os.tmpdir(), 'asyncapi-generated'),
        templates: path.resolve(__dirname, '../templates')
      });

      config.templates = `${config.templates}/${config.template}`;

      resolve(config);
    })
    .catch(reject);
});

/**
 * Outputs the result of compiling a template.
 *
 * @module generator.generate
 * @param  {Object}        config Configuration options
 * @param  {Object|String} config.asyncapi AsyncAPI JSON or a string pointing to an AsyncAPI file.
 * @param  {String}        config.target_dir Path to the directory where the files will be generated.
 * @return {Promise}
 */
generator.generate = config => new Promise((resolve, reject) => {
  bundleAndApplyDefaults(config)
    .then((cfg) => {
      async function start () {
        await registerHelpers(cfg);
        await registerPartials(cfg);
        await generateDirectoryStructure(cfg);
      }

      start().then(resolve).catch(reject);
    })
    .catch(reject);
});

/**
 * Generates a file in a given template.
 *
 * @param  {object} options
 * @param  {string} [templatesDir] Directory where templates are located. Defaults to internal template directory.
 * @param  {string} template Name of the template to use.
 * @param  {string} file Path to the template file you want to generate.
 * @param  {object} config Configuration options.
 * @param  {string|object} asyncapi An AsyncAPI definition.
 * @return {Promise<string, Error>} A promise that resolves with the generated content.
 */
generator.generateTemplateFile = ({
  templatesDir = path.resolve(__dirname, '../templates'),
  template,
  file,
  config,
}) => new Promise((resolve, reject) => {
  bundleAndApplyDefaults({
    ...config,
    ...{
      template,
    }
  })
  .then((cfg) => {
    async function start () {
      await registerHelpers(cfg);
      await registerPartials(cfg);
      return renderFile(path.resolve(templatesDir, template, file), cfg);
    }

    return start().then(resolve).catch(reject);
  })
  .catch(reject);
});

/**
 * Reads the content of a file in a given template.
 *
 * @param  {object} options
 * @param  {string} [templatesDir] Directory where templates are located. Defaults to internal template directory.
 * @param  {string} template Name of the template to use.
 * @param  {string} file Path to the template file you want to generate.
 * @return {Promise<string, Error>} A promise that resolves with the generated content.
 */
generator.getTemplateFile = ({
  templatesDir = path.resolve(__dirname, '../templates'),
  template,
  file,
}) => new Promise((resolve, reject) => {
  fs.readFile(path.resolve(templatesDir, template, file), 'utf8', (err, content) => {
    if (err) return reject(err);
    resolve(content);
  });
});
