const fs = require('fs');
const path = require('path');

module.exports = register => {
  register('generate:after', async (generator) => {
    const applicationPath = 'src/main/resources/application.yml';
    const applicationFile = path.resolve(generator.targetDir, applicationPath);
    const contents = await fs.promises.readFile(applicationFile, 'utf8');
    const newContents = contents.replace(/:\{port\}/, '');
    await fs.promises.writeFile(applicationFile, newContents, 'utf8');
  });
};