const fs = require('fs');
const path = require('path');

module.exports = register => {
  register('generate:after', generator => {
    if (generator.entrypoint && generator.entrypoint !== '__.gitignore') return;
    fs.renameSync(path.resolve(generator.targetDir, '__.gitignore'), path.resolve(generator.targetDir, '.gitignore'));
  });
};
