const generateHtml = require('./templates/generateHtml');
const generateJavaSpring = require('./templates/generateJavaSpring');
const CONSTANTS = require('../CONSTANTS');
const pathToExpectedTemplates = CONSTANTS.DEFAULT_PATH_TO_EXTPECTED_TEMPLATES;
const pathToExpectedHtmlTemplates = `${pathToExpectedTemplates}/html`;
const pathToExpectedJavaSpringTemplates = `${pathToExpectedTemplates}/java-spring`;
const {handlePromiseGracefully} = require('../../../utils/utils');
async function generate() {
  try {
    await generateHtml(pathToExpectedHtmlTemplates);
    await generateJavaSpring(pathToExpectedJavaSpringTemplates);
    // ... more templates to generate
    console.log('Done generating templates');
  } catch (e) {
    console.log(e);
  }
}
module.exports = async () => await handlePromiseGracefully(generate());
module.exports.generateHtml = async () => await handlePromiseGracefully(generateHtml(pathToExpectedHtmlTemplates));
module.exports.generateJavaSpring = async () => await handlePromiseGracefully(generateJavaSpring(pathToExpectedJavaSpringTemplates));

