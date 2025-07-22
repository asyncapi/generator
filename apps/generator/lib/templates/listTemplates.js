const templates = require('./coreTemplatesList.json');
const path = require('path');
const { access } = require('fs/promises');

module.exports.listTemplates = (filter) => {
  const { type, stack, protocol, target } = filter || {};

  return templates.filter(t =>
    (!type || t.type === type) &&
    (!stack || t.stack === stack) &&
    (!protocol || t.protocol === protocol) &&
    (!target || t.target === target)
  );
};

module.exports.isCoreTemplate = (templateName) => {
  return templates.some(t => !templateName || t.name === templateName);
};

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