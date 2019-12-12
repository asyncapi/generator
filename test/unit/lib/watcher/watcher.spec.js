const expect = require('chai').expect;
const {describe, before, it} = require('mocha');
const Watcher = require('../../../../lib/watcher');
const fs = require('fs');
describe('watcher', () => {
  before(() => {
    fs.writeFileSync('./');
  });
  it('no parameters', () => {
    let watcher = new Watcher([]);
  });
  describe('should be able to watch individual files', () => {

  });
  describe('should be able to watch directories', () => {

  });
});
