const customFilters = require('../src/customFilters');
const lodashFilters = require('../src/lodashFilters');

module.exports = Object.assign({}, lodashFilters, customFilters);