const test = require("ava");
const {containNoTag} = require("../filters/all");

const undef = undefined;

test.beforeEach(t => {
  t.context.foo = { name: "foo" };
  t.context.foo._json = t.context.foo;
  t.context.bar = { name: "bar" };
  t.context.bar._json = t.context.bar;
  t.context.tagsToCheck = [t.context.foo, t.context.bar];
  t.context.publish = { publish: { tags: [{ name: "foo" }, { name: "bar" }] } };
  t.context.publish._json = t.context.publish;
  t.context.subscribe = { subscribe: { tags: [{ name: "foo" }, { name: "bar" }] } };
  t.context.subscribe._json = t.context.subscribe;
});

test("throws an error when channels is falsy", t => {
  const error = t.throws(() =>
    { containNoTag(undef, t.context.tagsToCheck) }, { instanceOf: Error }
  );
  t.is(error.message, "Channels for containNoTag was not provided?");
});

test("returns false when channels contains no elements", t => {
  t.context.channel = [];
  t.false(containNoTag(t.context.channel, t.context.tagsToCheck)); 
});

test("returns true when channel.publish.tags is falsy", t => {
  t.context.publish = { publish: { tags: undef } };
  t.context.publish._json = t.context.publish;
  t.true(containNoTag([t.context.publish, t.context.subscribe], t.context.tagsToCheck));
});

test("returns true when channel.publish.tags is empty", t => {
  t.context.publish = { publish: { tags: [] } };
  t.context.publish._json = t.context.publish;
  t.true(containNoTag([t.context.publish, t.context.subscribe], t.context.tagsToCheck));
});

test("returns true when channel.subscribe.tags is falsy", t => {
  t.context.subscribe = { subscribe: { tags: undef } };
  t.context.subscribe._json = t.context.subscribe;
  t.true(containNoTag([t.context.publish, t.context.subscribe], t.context.tagsToCheck));
});

test("returns true when channel.subscribe.tags is empty", t => {
  t.context.subscribe = { subscribe: { tags: [] } };
  t.context.subscribe._json = t.context.subscribe;
  t.true(containNoTag([t.context.publish, t.context.subscribe], t.context.tagsToCheck));
});

test("returns true if none of the tags in channel.publish/subscribe match with the given tags to check", t => {
  t.context.foobar = { name: "foobar" };
  t.context.foobar._json = t.context.foobar;
  t.context.foobaz = { name: "foobaz" };
  t.context.foobaz._json = t.context.foobaz;
  t.true(containNoTag([t.context.publish, t.context.subscribe], [t.context.foobar, t.context.foobaz]));
});

test("returns true when tagsToCheck is an array of strings and none of them matches", t => {
  t.true(containNoTag([t.context.publish, t.context.subscribe], ["foobaz", "foobar"]));
});
