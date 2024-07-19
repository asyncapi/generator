const customFilters = require('./customFilters');
const lodashFilters = require('./lodashFilters');

module.exports = Object.assign({}, lodashFilters, customFilters);