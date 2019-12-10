/* eslint-disable no-undef */
const dircompare = require('dir-compare');
const options = { compareSize: true };
const pathToExpectedTemplates = './test/templates/java-spring';
const pathToactualTemplates = './test/integration/templates/actual/java-spring';
const { exec } = require('child_process');
const expect = require('chai').expect;
const {deleteFolderRecursive} = require('../utils/utils');
describe('java-spring', () => {
  before(() => {
    deleteFolderRecursive(pathToactualTemplates);
  });
  it('no parameters', () => {
    return new Promise((resolve, reject) => {
      const child = exec(`node ./cli.js --output ${pathToactualTemplates}/no-params ./test/docs/streetlights.yml java-spring`);
      child.stderr.pipe(process.stderr);
      child.on('error', (e) => {
        reject(e);
      });
      child.on('exit', (code) => {
        if (code === 0) {
          const res = dircompare.compareSync(`${pathToactualTemplates}/no-params`, `${pathToExpectedTemplates}/no-params`, options);
          try {
            expect(res.same).to.be.true;
            resolve();
            deleteFolderRecursive(pathToactualTemplates);
          }catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Error code ${code} was returned`));
        }
      });
    });
  });
});
