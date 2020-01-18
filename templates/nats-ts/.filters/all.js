const URL = require('url');
const path = require('path');

module.exports = ({ Nunjucks, _ }) => {
  Nunjucks.addFilter('kebabCase', string => {
    return _.kebabCase(string);
  });

  Nunjucks.addFilter('camelCase', string => {
    return _.camelCase(string);
  });

  Nunjucks.addFilter('firstLowerCase', string => {
    return _.lowerFirst(string);
  });

  Nunjucks.addFilter('toTsType', jsonType => {
    switch (jsonType.toLowerCase()) {
      case 'string':
        return 'String';
      case 'integer':
      case 'number':
        return 'Number';
      case 'boolean':
        return 'Boolean';
    }
  });

  Nunjucks.addFilter('constructurParameters', schema => {
    let returnString = '';
    console.log(schema);
    if (schema.allOf()) {
      console.log('all of');
      schema.allOf().forEach(element => {
        returnString += `${element.uid()},`;
      });
    }

    if (schema.oneOf()) {
      console.log('one of');
      schema.oneOf().forEach(element => {
        returnString += `${element.uid()},`;
      });
    }

    if (schema.anyOf()) {
      console.log('any of');
      schema.anyOf().forEach(element => {
        returnString += `${element.uid()},`;
      });
    }

    if (schema.uid()) {
      console.log('uid');
      returnString += `${schema.uid()},`;
    }
    if (returnString.length > 1) {
      returnString = returnString.slice(0, -1);
    }
    console.log(returnString);
    return returnString;
  });

  Nunjucks.addFilter('schemaConstructor', properties => {
    let returnString = '';
    for (const [key, value] of Object.entries(properties)) {
      returnString += `${key},`;
    }
    if (returnString.length > 1) {
      returnString = returnString.slice(0, -1);
    }
    return returnString;
  });

  Nunjucks.addFilter('oneLine', string => {
    if (!string) return string;
    return string.replace(/\n/g, ' ');
  });

  function getTypeFromOneOf(oneFromSchema) {
    let type = '';

    if (oneFromSchema.oneOf().length > 0) {
      type += getTypeFromOneOf(oneFromSchema.oneOf());
    }

    for (var i = 0; i < oneOfSchema.length; i++) {
      let schema = oneOfSchema[i];
      if (type !== '') {
        type += '|';
      }
      if (oneOfSchema.length == i + 1) {
        type += schema.uid()
      } else {
        type += schema.uid() + '|'
      }
    }
    return type;
  }
  Nunjucks.addFilter('oneOfSchemaType', getTypeFromOneOf);

  Nunjucks.addFilter('fileName', string => {
    return _.camelCase(string);
  });

  Nunjucks.addFilter('containsTag', (array, tag) => {
    if (!array || !tag) {
      return false;
    }
    return array.find(value => {
      return tag === value.name();
    });
  });


  Nunjucks.addFilter('tsPayload', (str) => {
    return "str";
  });
  Nunjucks.addFilter('tsEncoding', (str) => {
    return "str";
  });


  Nunjucks.addFilter('isPubsub', channel => {
    let tempChannel = channel._json;
    if (tempChannel.bindings.nats && tempChannel.bindings.nats.is == 'pubsub') {
      return true;
    }
    return false;
  });

  Nunjucks.addFilter('isRequestReply', channel => {
    let tempChannel = channel._json;
    if (tempChannel.bindings.nats && tempChannel.bindings.nats.is == 'requestReply') {
      return true;
    }
    return false;
  });

  Nunjucks.addFilter('isRequester', channel => {
    let tempChannel = channel._json;
    if (tempChannel.bindings.nats && tempChannel.bindings.nats.is == 'requestReply' && tempChannel.bindings.nats.requestReply && tempChannel.bindings.nats.requestReply.is == 'requester') {
      return true;
    }
    return false;
  });

  Nunjucks.addFilter('isReplier', channel => {
    let tempChannel = channel._json;
    if (tempChannel.bindings.nats && tempChannel.bindings.nats.is == 'requestReply' && tempChannel.bindings.nats.requestReply && tempChannel.bindings.nats.requestReply.is == 'replier') {
      return true;
    }
    return false;
  });
};
