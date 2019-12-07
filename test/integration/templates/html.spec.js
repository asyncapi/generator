/* eslint-disable no-undef */
const dircompare = require('dir-compare');
const options = { compareSize: true };
const pathToExpectedTemplates = './test/templates/html';
const pathToactualTemplates = './test/integration/templates/actual/html';
const { exec } = require('child_process');
const fs = require('fs');
const Path = require('path');
const format = require('util').format;
var expect = require('chai').expect;
const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      const curPath = Path.join(path, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
describe('html', () => {
  before(() => {
    deleteFolderRecursive(pathToactualTemplates);
  });
  it('no parameters', () => {
    return new Promise((resolve, reject) => {
      const child = exec(`node ./cli.js --output ${pathToactualTemplates}/no-params ./test/docs/streetlights.yml html`);
      child.stderr.pipe(process.stderr);
      child.on('error', (e) => {
        reject(e);
      });
      child.on('exit', (code) => {
        if (code === 0) {
          const res = dircompare.compareSync(pathToactualTemplates+"/no-params", `${pathToExpectedTemplates}/no-params`, options);
          try{
            expect(res.same).to.be.true;
            resolve();
            deleteFolderRecursive(pathToactualTemplates);
          }catch(e){
            reject(e);
          }
        } else {
          reject(new Error(`Error code ${code} was returned`));
        }
      });
    });
  });
});
