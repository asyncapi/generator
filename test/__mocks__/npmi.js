const npmi = module.exports = jest.fn(async (options, callback) => {
  npmi.__callback__(npmi.__callbackResults__[0], npmi.__callbackResults__[1]);
});

npmi.__callbackResults__ = [null, 'testResult'];
npmi.__callback__ = jest.fn();

module.exports = npmi;
