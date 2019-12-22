const fs = require('fs');
const path = require('path');
var renameAllSync = function (dir) {
  files = fs.readdirSync(dir);
  files.forEach(function (file) {
    let filepath = path.resolve(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      renameAllSync(filepath);
    }
    else if(path.extname(filepath) === '.njk') {
      let newPath = path.resolve(dir, path.basename(filepath, '.njk') + '.ts');
      fs.renameSync(filepath, newPath);
    }
  });
};
module.exports = register => {
  register('generate:after', generator => {
    //rename all njk extensions with typescript
    renameAllSync(path.resolve(generator.targetDir));
  });
};
