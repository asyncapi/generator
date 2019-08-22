const fs   = require('fs');
const path = require('path');

module.exports = ({Nunjucks, Markdown, OpenAPISampler}) => {
  /**
   * Allows for loading a file directly into the template
   */
  Nunjucks.addGlobal('loadRaw', (filePath) => {
    if (typeof filePath !== 'string') return filePath;
    return fs.readFileSync(`${__dirname}${path.sep}..${path.sep}${filePath}`);
  });
};
