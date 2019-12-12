
const { generateTemplate } = require('./utils');
const asyncFile = './test/docs/streetlights.yml';

function generate(pathToTemplates) {
  return new Promise(async (resolve, reject) => {
    // Generate html templates
    try {
      await generateNoParams(pathToTemplates);
      // ... more templates to generate
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

function generateNoParams(pathToTemplates) {
  return new Promise(async (resolve, reject) => {
    try {
      await generateTemplate(`${pathToTemplates}/no-params`, asyncFile, 'html', '');
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}
module.exports = generate;
module.exports.noParams = generateNoParams;
