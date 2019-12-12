const generateHtml = require('./templates/generateHtml');
const generateJavaSpring = require('./templates/generateJavaSpring');
const CONSTANTS = require('../CONSTANTS');
const pathToExpectedTemplates = CONSTANTS.DEFAULT_PATH_TO_EXTPECTED_TEMPLATES;
const {handlePromiseGracefully} = require('../../../utils/utils');
async function generate() {
  try {
    await generateHtml(`${pathToExpectedTemplates}/html`);
    await generateJavaSpring(`${pathToExpectedTemplates}/java-spring`);
    // ... more templates to generate
    console.log('Done generating templates');
  } catch (e) {
    console.log(e);
  }
}
module.exports = async () => await handlePromiseGracefully(generate());
module.exports.generateHtml = async () => await handlePromiseGracefully(generateHtml(pathToExpectedTemplates));
module.exports.generateJavaSpring = async () => await handlePromiseGracefully(generateJavaSpring(pathToExpectedTemplates));

