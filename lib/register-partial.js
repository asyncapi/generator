const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const Handlebars = require('handlebars');

const getFileContent = filePath => {
  return fs.readFileSync(filePath, 'utf8');
};

module.exports = async filePath => {
  const partialName = _.camelCase(path.basename(filePath, path.extname(filePath)));
  Handlebars.registerPartial(partialName, getFileContent(filePath));
};
