const templates = require('./BakedInTemplatesList.json');
const path = require('path');

const BAKED_IN_TEMPLATES_DIR = path.resolve(__dirname, 'bakedInTemplates');
/**
 * List core templates, optionally filter by type, stack, protocol, or target.
 * Use name of returned templates as input for the `generate` method for template generation. Such core templates code is part of the @asyncapi/generator package.
 * 
 * @param {Object} [filter] - Optional filter object.
 * @param {string} [filter.type] - Filter by template type (e.g., 'client', 'docs').
 * @param {string} [filter.stack] - Filter by stack (e.g., 'quarkus', 'express').
 * @param {string} [filter.protocol] - Filter by protocol (e.g., 'websocket', 'http').
 * @param {string} [filter.target] - Filter by target language or format (e.g., 'javascript', 'html').
 * @returns {Array<Object>} Array of template objects matching the filter.
 */
module.exports.listBakedInTemplates = (filter) => {
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
  return templates.some(t => t.name === templateName);
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
  if (templateName == null || typeof templateName !== 'string' || templateName.trim() === '') {
    throw new Error('Invalid template name');
  }
  const template = templates.find(t => t.name === templateName);
  if (!template) {
    throw new Error('Invalid template name');
  }
  const templatePath = template.path || path.resolve(__dirname, BAKED_IN_TEMPLATES_DIR, template.name);
  return {
    name: template.name,
    path: templatePath
  };
};