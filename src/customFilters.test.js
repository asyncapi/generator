const test = require('ava');
const {markdown2html, generateExample, oneLine} = require('./customFilters');

test('markdown2html returns valid html', t => {
  const is = t.is;
  const value =  markdown2html('**test**');
  const expected = '<p><strong>test</strong></p>\n';
    
  is(value, expected);
});

test('generateExample returns valid example', t => {
  const is = t.is;
  const value =  generateExample({ type: 'object', properties: { email: { type: 'string', format: 'email' } }, 'x-parser-schema-id': '<anonymous-schema-1>' });
  const expected = '{\n  "email": "user@example.com"\n}';
  
  is(value, expected);
});

test('oneLine returns one liner string', t => {
  const is = t.is;
  const value = oneLine(`This is
multiline`);
  const expected = 'This is multiline';
  
  is(value, expected);
});