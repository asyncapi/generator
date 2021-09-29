const filter = module.exports;

function isExpandable(obj) {
  const fun = (obj) => typeof obj === "function";
  if (
    (fun(obj.type) && obj.type() === "object") ||
    (fun(obj.type) && obj.type() === "array") ||
    (fun(obj.oneOf) && obj.oneOf() && obj.oneOf().length) ||
    (fun(obj.anyOf) && obj.anyOf() && obj.anyOf().length) ||
    (fun(obj.allOf) && obj.allOf() && obj.allOf().length) ||
    (fun(obj.items) && obj.items()) ||
    (fun(obj.additionalItems) && obj.additionalItems()) ||
    (fun(obj.properties) && obj.properties() && Object.keys(obj.properties()).length) ||
    (fun(obj.additionalProperties) && obj.additionalProperties()) ||
    (fun(obj.extensions) && obj.extensions() &&
      Object.keys(obj.extensions()).filter(e => !e.startsWith("x-parser-")).length) ||
    (fun(obj.patternProperties) && Object.keys(obj.patternProperties()).length)
  ) return true;

  return false;
}
filter.isExpandable = isExpandable;

function nonParserExtensions(schema) {
  if (!schema || !schema.extensions || typeof schema.extensions !== "function") return new Map();
  const extensions = Object.entries(schema.extensions());
  return new Map(extensions.filter(e => !e[0].startsWith("x-parser-")).filter(Boolean));
}
filter.nonParserExtensions = nonParserExtensions;

/**
 * Check if there is a channel which does not have one of the tags specified.
 */
function containTags(object, tagsToCheck) {
  if (!object) {
    throw new Error("object for containsTag was not provided?");
  }

  if (!tagsToCheck) {
    throw new Error("tagsToCheck for containsTag was not provided?");
  }

  //Ensure if only 1 tag are provided it is converted to array.
  if (tagsToCheck && !Array.isArray(tagsToCheck)) {
    tagsToCheck = [tagsToCheck];
  }
  //Check if pubsub contain one of the tags to check.
  let check = (tag) => {
    let found = false;
    for (let tagToCheckIndex in tagsToCheck) {
      let tagToCheck = tagsToCheck[tagToCheckIndex]._json;
      let tagName = tag.name;
      if ((tagToCheck && tagToCheck.name === tagName) ||
        tagsToCheck[tagToCheckIndex] === tagName) {
        found = true;
      }
    }
    return found;
  };

  //Ensure tags are checked for the group tags
  let containTags = object._json.tags ? object._json.tags.find(check) != null : false;
  return containTags;
}
filter.containTags = containTags;

/**
 * Check if there is a channel which does not have one of the tags specified.
 */
function containNoTag(channels, tagsToCheck) {
  if (!channels) {
    throw new Error("Channels for containNoTag was not provided?");
  }
  for (let channelIndex in channels) {
    let channel = channels[channelIndex]._json;
    //Check if the channel contains publish or subscribe which does not contain tags
    if (channel.publish && (!channel.publish.tags || channel.publish.tags.length == 0) ||
      channel.subscribe && (!channel.subscribe.tags || channel.subscribe.tags.length == 0)
    ) {
      //one does not contain tags
      return true;
    }

    //Check if channel publish or subscribe does not contain one of the tags to check.
    let check = (tag) => {
      let found = false;
      for (let tagToCheckIndex in tagsToCheck) {
        let tagToCheck = tagsToCheck[tagToCheckIndex]._json;
        let tagName = tag.name;
        if ((typeof tagToCheck !== 'undefined' && tagToCheck.name === tagName) ||
          tagsToCheck[tagToCheckIndex] === tagName) {
          found = true;
        }
      }
      return found;
    };

    //Ensure pubsub tags are checked for the group tags
    let publishContainsNoTag = channel.publish && channel.publish.tags ? channel.publish.tags.find(check) == null : false;
    if (publishContainsNoTag === true) return true;
    let subscribeContainsNoTag = channel.subscribe && channel.subscribe.tags ? channel.subscribe.tags.find(check) == null : false;
    if (subscribeContainsNoTag === true) return true;
  }
  return false;
}
filter.containNoTag = containNoTag;

function operationsTags(object) {
  let tags = new Set();
  const extractName = (tags, acc) => tags.forEach((tag) => acc.add(tag.name()));
  object.channelNames().forEach(channelName => {
    let channel = object.channel(channelName);
    if (channel.hasPublish() && channel.publish().hasTags()) extractName(channel.publish().tags(), tags);
    if (channel.hasSubscribe() && channel.subscribe().hasTags()) extractName(channel.subscribe().tags(), tags);
  });
  return Array.from(tags);
}
filter.operationsTags = operationsTags;
