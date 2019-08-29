const fs = require('fs');
const path = require('path');

module.exports = register => {
  register('generate:after', generator => {
    const asyncapi = generator.originalAsyncAPI;
    let extension;

    try {
      JSON.parse(asyncapi);
      extension = 'json';
    } catch (e) {
      extension = 'yaml';
    }

    fs.writeFileSync(path.resolve(generator.targetDir, `asyncapi.${extension}`), asyncapi);
  });
};
