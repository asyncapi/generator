const _ = require('lodash');
const filter = module.exports;

Object.getOwnPropertyNames(_).forEach((key) => {
  if (_.isFunction(_[key])) filter[key] = _[key];
});