const dircompare = require('dir-compare');
const options = { compareSize: true };
const pathToExpectedTemplates = './test/integration/templates/expected/html';
const pathToactualTemplates = './test/integration/templates/actual/html';
const generateHtml = require('./generation scripts/utils/generateHtml');
const expect = require('chai').expect;
const { describe, before, it } = require('mocha');
const { deleteFolderRecursive } = require('../../utils/utils');
describe('html', () => {
  before(async () => {
    deleteFolderRecursive(pathToactualTemplates);
    await generateHtml(pathToactualTemplates);
  });

  it('no parameters', () => {
    const res = dircompare.compareSync(`${pathToactualTemplates}/no-params`, `${pathToExpectedTemplates}/no-params`, options);
    expect(res.same).to.be.true;
  });
});
