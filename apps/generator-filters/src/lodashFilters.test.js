const test = require('ava');
const filter = require('./lodashFilters');

test('lodash isArray function is available and works as expected', t => {
  t.truthy(filter.isArray([]));
});
