const dircompare = require('dir-compare');
const options = { compareSize: true };
const constants = require('./CONSTANTS');
const pathToExpectedTemplates = `${constants.DEFAULT_PATH_TO_EXTPECTED_TEMPLATES}/html`;
const pathToactualTemplates = `${constants.DEFAULT_PATH_TO_ACTUAL_TEMPLATES}/html`;
const generateHtml = require('./generation scripts/templates/generateHtml');
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
