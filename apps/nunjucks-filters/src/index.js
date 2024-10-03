const customFilters = require('./customFilters');
const lodashFilters = require('./lodashFilters');

module.exports = {
    ...lodashFilters,
    ...customFilters
  };