const test = require("ava");
const {nonParserExtensions} = require("../filters/all");

const undef = undefined;

test.beforeEach(t => t.context.doc = {});

test("returns an empty Map when schema is falsy", t => {
  const result = nonParserExtensions(undef);
  t.is(result.constructor.name, "Map");
  t.is(result.size, 0);
});

test("returns an empty Map when schema has no extensions", t => {
  const result = nonParserExtensions(t.context.doc);
  t.is(result.constructor.name, "Map");
  t.is(result.size, 0);
});

test("returns an empty Map when schema extensions is not a function", t => {
  t.context.doc.extensions = [];
  const result = nonParserExtensions(t.context.doc);
  t.is(result.constructor.name, "Map");
  t.is(result.size, 0);
});

test("returns a Map with the truthy schema extensions that do not start with x-parser-", t => {
  t.context.doc.extensions = () => {
    return {
      "x-test": "x-test-val",
      "x-undef": undef,
      "x-parser-test": "x-parser-test-val"
    };
  };
  t.deepEqual(
    nonParserExtensions(t.context.doc),
    new Map([["x-test", "x-test-val"], ["x-undef", undef]])
  );
});
