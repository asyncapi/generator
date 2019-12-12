/* eslint-disable no-undef */
const dircompare = require('dir-compare');
const options = { compareSize: true };
const constants = require('./CONSTANTS');
const pathToExpectedTemplates = `${constants.DEFAULT_PATH_TO_EXTPECTED_TEMPLATES}/java-spring`;
const pathToactualTemplates = `${constants.DEFAULT_PATH_TO_ACTUAL_TEMPLATES}/java-spring`;
const generateJavaSpring = require('./generation scripts/templates/generateJavaSpring');
const expect = require('chai').expect;
const { deleteFolderRecursive } = require('../../utils/utils');
describe('java-spring', () => {
  before(async () => {
    deleteFolderRecursive(pathToactualTemplates);
    await generateJavaSpring(pathToactualTemplates);
  });
  it('no parameters', () => {
    const res = dircompare.compareSync(`${pathToactualTemplates}/no-params`, `${pathToExpectedTemplates}/no-params`, options);
    expect(res.same).to.be.true;
  });
});
