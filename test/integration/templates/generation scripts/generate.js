const generateHtml = require('./utils/generateHtml');
const generateJavaSpring = require('./utils/generateJavaSpring');
const pathToExpectedTemplates = './test/integration/templates/expected/html';
async function generate() {
  try {
    await generateHtml(pathToExpectedTemplates);
    await generateJavaSpring(pathToExpectedTemplates);
    // ... more templates to generate
    console.log('Done generating html templates');
  } catch (e) {
    console.log(e);
  }
}
generate();
