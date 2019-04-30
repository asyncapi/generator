const OpenAPISampler = require('openapi-sampler');
const _ = require('lodash');
const md = require('markdown-it')();

const sharedStart = (array) => {
  const A = array.concat().sort();
  const a1 = A[0], a2 = A[A.length - 1], L = a1.length;
  let i = 0;
  while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
  return a1.substring(0, i);
};

const resolveAllOf = (schema) => {
  if (schema.allOf) {
    const schemas = [];
    schema.allOf.forEach((s) => {
      schemas.push(resolveAllOf(s));
    });

    return resolveAllOf(_.merge({}, ...schemas));
  }

  if (schema.properties) {
    const transformed = {};

    for (const key in schema.properties) {
      if (schema.properties[key].allOf) {
        transformed[key] = resolveAllOf(schema.properties[key]);
        continue;
      }
      transformed[key] = schema.properties[key];
    }

    return {
      ...schema,
      ...{ properties: transformed }
    };
  }

  return schema;
};

const stringify = json => json !== undefined ? JSON.stringify(json, null, 2) : undefined;
const generateExample = schema => {
  try {
    return OpenAPISampler.sample(schema);
  } catch (e) {
    return;
  }
};

const beautifyMessage = (message) => {
  if (message.payload) message.payload = resolveAllOf(message.payload);
  if (message.headers) message.headers = resolveAllOf(message.headers);
  message.descriptionAsHTML = md.render(message.description || '');

  if (message.headers) {
    _.each(message.headers, beautifySchema);

    message.formattedHeadersExamples = [];
    if (message.examples) {
      message.examples.forEach((example) => {
        if (example.headers) {
          message.hasHeadersExample = true;
          message.formattedHeadersExamples.push(stringify(example.headers));
        }
      });
    }

    if (!message.formattedHeadersExamples.length) {
      message.hasHeadersExample = true;
      message.generatedHeadersExample = {};
      _.each(message.headers, (header, headerName) => {
        message.generatedHeadersExample[headerName] = generateExample(header);
      });
      message.generatedHeadersExample = stringify(message.generatedHeadersExample);
    }
  }

  if (message.payload) {
    beautifySchema(message.payload);

    message.formattedPayloadExamples = [];
    if (message.examples) {
      message.examples.forEach((example) => {
        if (example.payload) {
          message.hasPayloadExample = true;
          message.formattedPayloadExamples.push(stringify(example.payload));
        }
      });
    }

    if (!message.formattedPayloadExamples.length) {
      let payload = message.payload;
      if (message.oneOf) payload = message.oneOf[0].payload;

      if (payload) {
        message.hasPayloadExample = true;
        message.generatedPayloadExample = stringify(generateExample(payload));
      }
    }
  }

  if (message.oneOf) {
    message.formattedHeadersExamples = [];
    message.formattedPayloadExamples = [];

    message.oneOf.forEach(msg => {
      if (msg.headers) _.each(msg.headers, beautifySchema);
      if (msg.payload) beautifySchema(msg.payload);

      if (msg.examples) {
        msg.examples.forEach((example) => {
          if (example.headers) {
            message.hasHeadersExample = true;
            message.formattedHeadersExamples.push(stringify(example.headers));
          }

          if (example.payload) {
            message.hasPayloadExample = true;
            message.formattedPayloadExamples.push(stringify(example.payload));
          }
        });
      }
    });

    if (!message.formattedHeadersExamples.length && message.oneOf[0].headers) {
      message.hasHeadersExample = true;
      message.generatedHeadersExample = {};
      _.each(message.oneOf[0].headers, (header, headerName) => {
        message.generatedHeadersExample[headerName] = generateExample(header);
      });
      message.generatedHeadersExample = stringify(message.generatedHeadersExample);
    }

    if (!message.formattedPayloadExamples.length) {
      const payload = message.oneOf[0].payload;
      if (payload) {
        message.hasPayloadExample = true;
        message.generatedPayloadExample = stringify(generateExample(payload));
      }
    }
  }

  message.uid = Buffer.from(JSON.stringify(message)).toString('base64');

  return message;
};

const beautifySchema = (schema) => {
  _.each(schema.properties, (prop, propName) => {
    if (prop.description) prop.descriptionAsHTML = md.render(prop.description || '');
    if (prop.properties) beautifySchema(prop);
  });
  _.each(schema.additionalProperties, (prop, propName) => {
    if (prop.description) prop.descriptionAsHTML = md.render(prop.description || '');
    if (prop.additionalProperties) beautifySchema(prop);
  });
};

module.exports = (asyncapi) => {
  asyncapi.info = asyncapi.info || {};
  asyncapi.info.descriptionAsHTML = md.render(asyncapi.info.description || '');

  if (asyncapi.servers) {
    _.each(asyncapi.servers, server => {
      server.descriptionAsHTML = md.render(server.description || '');

      if (server.security) {
        server._security = [];

        _.each(server.security, security => {
          const name = Object.keys(security)[0];
          if (!asyncapi.components || !asyncapi.components.securitySchemes || !asyncapi.components.securitySchemes[name]) {
            throw new Error(`Security definition "${name}" is not in included in #/components/securitySchemes.`);
          }

          asyncapi.components.securitySchemes[name].descriptionAsHTML = md.render(asyncapi.components.securitySchemes[name].description || '');
          server._security.push(asyncapi.components.securitySchemes[name]);
        });
      }

      _.each(server.variables, variable => {
        variable.descriptionAsHTML = md.render(variable.description || '');
      });
    });
  }

  if (asyncapi.channels) {
    asyncapi.subscribeChannels = {};
    asyncapi.publishChannels = {};
  }

  _.each(asyncapi.channels, (channel, channelName) => {
    if (channel.subscribe) {
      if (channel.subscribe.message) {
        channel.subscribe.descriptionAsHTML = md.render(channel.subscribe.description || '');
        beautifyMessage(channel.subscribe.message);
      } else if (channel.subscribe.message && channel.subscribe.message.oneOf) {
        _.each(channel.subscribe.message.oneOf, beautifyMessage);
      }

      asyncapi.subscribeChannels[channelName] = channel;
    }

    if (channel.publish) {
      if (channel.publish.message) {
        channel.publish.descriptionAsHTML = md.render(channel.publish.description || '');
        beautifyMessage(channel.publish.message);
      } else if (channel.publish.message && channel.publish.message.oneOf) {
        _.each(channel.publish.message.oneOf, beautifyMessage);
      }

      asyncapi.publishChannels[channelName] = channel;
    }

    if (channel.parameters) {
      channel.parameters.forEach((param) => {
        param.descriptionAsHTML = md.render(param.description || '');
      });
    }
  });

  if (!asyncapi.components) asyncapi.components = {};

  if (asyncapi.channels) {
    const commonPrefix = sharedStart(Object.keys(asyncapi.channels));
    const levels = commonPrefix.split('/').length - 1;
    asyncapi.__commonPrefix = commonPrefix.split('/').slice(0, levels).join('/');
  }

  return asyncapi;
};
