const fs = require('fs');
const Path = require('path');
const { exec } = require('child_process');
module.exports.deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        module.exports.deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
module.exports.generateTemplate = (outputDir, documentationFile, template, parameters) => {
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
};

module.exports.handlePromiseGracefully = async (promise) => {
  try {
    await promise;
  }
  catch (error) {
    console.log(error);
  }
};
