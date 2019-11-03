module.exports = ({ Nunjucks, Markdown, OpenAPISampler }) => {
  Nunjucks.addFilter('split', (string, separator) => {
    if (typeof string !== 'string') return string;
    const regex = new RegExp(separator, 'g');
    return string.split(regex);
  });

  Nunjucks.addFilter('firstKey', (obj) => {
    if (!obj) return '';
    return Object.keys(obj)[0];
  });

  Nunjucks.addFilter('isExpandable', (obj) => {
    if (
      obj.type() === 'object' ||
      obj.type() === 'array' ||
      (obj.oneOf() && obj.oneOf().length) ||
      (obj.anyOf() && obj.anyOf().length) ||
      (obj.allOf() && obj.allOf().length) ||
      obj.items() ||
      obj.additionalItems() ||
      (obj.properties() && Object.keys(obj.properties()).length) ||
      obj.additionalProperties() ||
      obj.patternProperties()
    ) return true;

    return false;
  });

  /**
   * Check if there is a channel which does not have one of the tags specified.
   */
	Nunjucks.addFilter('containTags', (object, tagsToCheck) => {
		if (!object) {
      throw new Error("object for containsTag was not provided?");
    }
		if (!tagsToCheck) {
      throw new Error("tagsToCheck for containsTag was not provided?");
    }
    
    //Ensure if only 1 tag are provided it is converted to array.
    if(tagsToCheck && !Array.isArray(tagsToCheck)){
      tagsToCheck = [tagsToCheck];
    }

    //Check that pubsub does not contain one of the tags to check.
    let check = (tag) => {
      let found = false;
      for(let tagToCheckIndex in tagsToCheck){
        let tagToCheck = tagsToCheck[tagToCheckIndex]._json;
        if(tagToCheck.name === tag.name){
          found = true;
        }
      }
      return found;
    };

    //Ensure pubsub tags are checked for the group tags
    let pubsubContainsNoTag = object._json.tags ? object._json.tags.find(check) != null : false;
    if(pubsubContainsNoTag === true) return true;
    return false;
  });

  /**
   * Check if there is a channel which does not have one of the tags specified.
   */
	Nunjucks.addFilter('containNoTag', (channels, tagsToCheck) => {
		if (!channels) {
      throw new Error("Channels for containNoTag was not provided?");
    }
    for(let channelIndex in channels){
      let channel = channels[channelIndex]._json;
      //Check if the channel contains publish or subscribe which does not contain tags
      if(channel.publish && (!channel.publish.tags || channel.publish.tags.length == 0) ||
        channel.subscribe && (!channel.subscribe.tags || channel.subscribe.tags.length == 0)
      ){
        //one does not contain tags
        return true;
      }

      //Check if channel publish or subscribe does not contain one of the tags to check.
      let check = (tag) => {
        let found = false;
        for(let tagToCheckIndex in tagsToCheck){
          let tagToCheck = tagsToCheck[tagToCheckIndex]._json;
          if(tagToCheck.name === tag.name){
            found = true;
          }
        }
        return found;
      };

      //Ensure pubsub tags are checked for the group tags
      let publishContainsNoTag = channel.publish && channel.publish.tags ? channel.publish.tags.find(check) == null : false;
      if(publishContainsNoTag === true) return true;
      let subscribeContainsNoTag = channel.subscribe && channel.subscribe.tags ? channel.subscribe.tags.find(check) == null : false;
      if(subscribeContainsNoTag === true) return true;
    }
    return false;
  });
  
  Nunjucks.addFilter('isArray', (arr) => {
    return Array.isArray(arr);
  });

  Nunjucks.addFilter('contains', (array, element) => {
    if (!array || !Array.isArray(array)) return false;
    return array.includes(element);
  });

  Nunjucks.addFilter('log', (anything) => {
    console.log(anything);
  });

  Nunjucks.addFilter('markdown2html', (md) => {
    return Markdown().render(md || '');
  });

  Nunjucks.addFilter('getPayloadExamples', (msg) => {
    if (Array.isArray(msg.examples()) && msg.find(e => e.payload)) {
      return msg.filter(e => e.payload);
    }

    if (msg.payload() && msg.payload().examples()) {
      return msg.payload().examples();
    }
  });

  Nunjucks.addFilter('getHeadersExamples', (msg) => {
    if (Array.isArray(msg.examples()) && msg.find(e => e.headers)) {
      return msg.filter(e => e.headers);
    }

    if (msg.headers() && msg.headers().examples()) {
      return msg.headers().examples();
    }
  });

  Nunjucks.addFilter('generateExample', (schema) => {
    return JSON.stringify(OpenAPISampler.sample(schema) || '', null, 2);
  });
};
