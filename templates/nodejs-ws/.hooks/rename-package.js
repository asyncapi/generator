const fs = require('fs');
const path = require('path');

module.exports = register => {
  register('generate:after', generator => {
    if (generator.entrypoint && generator.entrypoint !== '__package.json') return;
    fs.renameSync(path.resolve(generator.targetDir, '__package.json'), path.resolve(generator.targetDir, 'package.json'));
  });
};
