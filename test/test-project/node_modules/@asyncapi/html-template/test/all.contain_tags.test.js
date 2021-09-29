const test = require("ava");
const {containTags} = require("../filters/all");

const undef = undefined;

test.beforeEach(t => {
  t.context.foo = { name: "foo" };
  t.context.foo._json = t.context.foo;
  t.context.bar = { name: "bar" };
  t.context.bar._json = t.context.bar;
  t.context.doc = { tags: [t.context.foo, t.context.bar] };
  t.context.doc._json = t.context.doc;
});

test("throws an error when object is falsy", t => {
  const error = t.throws(() =>
    { containTags(undef, [t.context.foo, t.context.bar]) }, { instanceOf: Error }
  );
  t.is(error.message, "object for containsTag was not provided?");
});

test("throws an error when tagsToCheck is falsy", t => {
  const error = t.throws(() => {
    containTags(t.context.doc, undef) }, { instanceOf: Error }
  );
  t.is(error.message, "tagsToCheck for containsTag was not provided?");
});

test("returns false if no tag in the object match with the given tags to check", t => {
  t.context.foz = { name: "foz" };
  t.context.foz._json = t.context.foz;
  t.context.baz = { name: "baz" };
  t.context.baz._json = t.context.baz;
  t.false(containTags(t.context.doc, [t.context.foz, t.context.baz]));
});

test("returns false if object given has no tags", t => {
  t.context.doc._json = { tags: undef };
  t.false(containTags(t.context.doc, [t.context.foo, t.context.bar]));
});

test("returns true if at least one tag in the object matches with the given tags to check", t => {
  t.context.baz = { name: "baz" };
  t.context.baz._json = t.context.baz;
  t.true(containTags(t.context.doc, [t.context.bar, t.context.baz]));
});

test("returns true when comparing tags even if tagsToCheck is a string", t => {
  t.true(containTags(t.context.doc, t.context.foo));
});

test("returns true when tagsToCheck is an array of strings and at least one of them matches", t => {
  t.true(containTags(t.context.doc, [t.context.foo.name, "foobar"]));
});
