
const { generateTemplate } = require('../../../../utils/utils');
const asyncFile = './test/docs/streetlights.yml';

function generate(pathToTemplates) {
  return new Promise(async (resolve, reject) => {
    try {
      await generateTemplate(`${pathToTemplates}/no-params`, asyncFile, 'java-spring', '');
      // ... more templates to generate
      console.log('Done generating java-spring templates');
      resolve();
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
}

module.exports = generate;
