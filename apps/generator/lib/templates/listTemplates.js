const templates = require('./coreTemplatesList.json');
const path = require('path');
const { access } = require('fs/promises');

/**
 * List core templates, optionally filtering by type, stack, protocol, or target.
 * 
 * @param {Object} [filter] - Optional filter object.
 * @param {string} [filter.type] - Filter by template type (e.g., 'client', 'docs').
 * @param {string} [filter.stack] - Filter by stack (e.g., 'quarkus', 'express').
 * @param {string} [filter.protocol] - Filter by protocol (e.g., 'websocket', 'http').
 * @param {string} [filter.target] - Filter by target language or format (e.g., 'javascript', 'html').
 * @returns {Array<Object>} Array of template objects matching the filter.
 */
module.exports.listTemplates = (filter) => {
  const { type, stack, protocol, target } = filter || {};

  return templates.filter(t =>
    (!type || t.type === type) &&
    (!stack || t.stack === stack) &&
    (!protocol || t.protocol === protocol) &&
    (!target || t.target === target)
  );
};

/**
 * Check if a template exists in the core templates list.
 * 
 * @param {string} templateName - The name of the template to check.
 * @returns {boolean} True if the template exists, false otherwise.
 */
module.exports.isCoreTemplate = (templateName) => {
  return templates.some(t => !templateName || t.name === templateName);
};

/**
 * Retrieve a template by name and validate its path.
 * If the path does not exist, fallback to `node_modules/{templateName}`.
 *
 * @async
 * @param {string} templateName - The name of the template to retrieve.
 * @returns {Promise<{name: string, path: string}|undefined>} An object containing the template's name and path, or undefined if not found.
 */
module.exports.getTemplate = async (templateName) => {
  const template = templates.find(t => t.name === templateName);

  let templatePath = template.path;
  try {
    // Try to access the path provided by core templates list
    await access(path.resolve(templatePath));
  } catch (e) {
    templatePath = path.join('node_modules', templateName);
  }

  return {
    name: template.name,
    path: templatePath
  };
};