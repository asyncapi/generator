const test = require("ava");
const {isExpandable} = require("../filters/all");

test.beforeEach(t => {
  t.context.doc = {};
  t.context.types = [{ type: "string" }, { type: "number" }];
  t.context.doc.patternProperties = () => ({});
});

test("isExpandable when the object type is object", t => {
  t.context.doc.type = () => "object";
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object type is array", t => {
  t.context.doc.type = () => "array";
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains oneOf", t => {
  t.context.doc.oneOf = () => t.context.types;
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains anyOf", t => {
  t.context.doc.anyOf = () => t.context.types;
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains allOf", t => {
  t.context.doc.allOf = () => t.context.types;
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains items", t => {
  t.context.doc.items = () => t.context.types;
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains additionalItems", t => {
  t.context.doc.additionalItems = () => t.context.types;
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains properties", t => {
  t.context.doc.properties = () => ({ test: { type: "string" }, test2: { type: "number" } });
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains additionalProperties", t => {
  t.context.doc.additionalProperties = () => t.context.types;
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains extensions", t => {
  t.context.doc.extensions = () => ({ "x-test": "testing" });
  t.true(isExpandable(t.context.doc));
});

test("isExpandable when the object contains patternProperties", t => {
  t.context.doc.patternProperties = () => ({ test: { type: "string" } });
  t.true(isExpandable(t.context.doc));
});

test("is not expandable when object does not return any of the previous cases", t => {
  t.false(isExpandable(t.context.doc));
});
