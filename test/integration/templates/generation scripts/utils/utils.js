
const { exec } = require('child_process');
exports.generateTemplate = (outputDir, documentationFile, template, parameters) => {
  return new Promise((resolve, reject) => {
    const child = exec(`node ./cli.js --output ${outputDir} ${parameters} ${documentationFile} ${template}`);
    child.stderr.pipe(process.stderr);
    child.on('error', (e) => {
      reject(e);
    });
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Error code ${code} was returned`));
      }
    });
  });
}
