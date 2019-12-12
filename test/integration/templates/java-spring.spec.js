/* eslint-disable no-undef */
const dircompare = require('dir-compare');
const options = { compareSize: true };
const pathToExpectedTemplates = './test/integration/templates/expected/java-spring';
const pathToactualTemplates = './test/integration/templates/actual/java-spring';
const generateJavaSpring = require('./generation scripts/utils/generateJavaSpring');
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
