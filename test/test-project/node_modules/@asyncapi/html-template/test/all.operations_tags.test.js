const test = require("ava");
const {operationsTags} = require("../filters/all");

const undef = undefined;

test.beforeEach(t => {
  t.context.parser = require("@asyncapi/parser");
});

test("it extracts the pub/sub tags names from the channel in the given object", t => {
  const pubTags = [{ name: "smartylighting" }, { name: "measure" }];
  const subTags = [{ name: "dim" }];
  const input = {
    channels: {
      "smartylighting/streetlights/1/0/event/1/lighting/measured": {
        publish: {
          tags: pubTags
        }
      },
      "smartylighting/streetlights/1/0/action/1/dim": {
        subscribe: {
          tags: subTags
        }
      }
    }
  };
  const doc = new t.context.parser.AsyncAPIDocument(input);
  const result = operationsTags(doc);

  t.deepEqual(result, pubTags.concat(subTags).map(({ name }) => name ));
  t.is(result.constructor.name, 'Array');
});

test("it extracts the pub/sub tags when present", t => {
  const pubTags = [{ name: "smartylighting" }, { name: "measure" }];
  const input = {
    channels: {
      "smartylighting/streetlights/1/0/event/1/lighting/measured": {
        publish: {
          tags: pubTags
        }
      },
      "smartylighting/streetlights/1/0/action/1/dim": {
        subscribe: {
          operationId: "dim"
        }
      }
    }
  };
  const doc = new t.context.parser.AsyncAPIDocument(input);
  const result = operationsTags(doc);

  t.deepEqual(result, pubTags.map(({ name }) => name ));
  t.is(result.constructor.name, 'Array');
});

test("it extracts the pub/sub tags without repeated values", t => {
  const subTags = pubTags = [{ name: "smartylighting" }];
  const input = {
    channels: {
      "smartylighting/streetlights/1/0/event/1/lighting/measured": {
        publish: {
          tags: pubTags
        }
      },
      "smartylighting/streetlights/1/0/action/1/dim": {
        subscribe: {
          operationId: subTags
        }
      }
    }
  };
  const doc = new t.context.parser.AsyncAPIDocument(input);
  const result = operationsTags(doc);

  t.deepEqual(result, pubTags.map(({ name }) => name ));
  t.is(result.constructor.name, 'Array');
});
