const OpenAPISampler = require('openapi-sampler');
const _ = require('lodash');
const md = require('markdown-it')();

const sharedStart = (array) => {
  const A = array.concat().sort();
  const a1 = A[0], a2= A[A.length-1], L= a1.length;
  let i = 0;
  while (i<L && a1.charAt(i)=== a2.charAt(i)) i++;
  return a1.substring(0, i);
};

const resolveAllOf = (schema) => {
  if (schema.allOf) {
    const schemas = [];
    schema.allOf.forEach((s) => {
      schemas.push(s);
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
  message.summaryAsHTML = md.render(message.summary || '');
  message.descriptionAsHTML = md.render(message.description || '');

  if (message.headers) {
    beautifySchema(message.headers);
    message.generatedHeadersExample = stringify(generateExample(message.headers));
  }
  if (message.payload) {
    beautifySchema(message.payload);
    if (message.payload.example) {
      message.formattedExample = stringify(message.payload.example);
    } else {
      message.generatedPayloadExample = stringify(generateExample(message.payload));
    }
  }

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
  asyncapi.baseTopic = asyncapi.baseTopic || '';
  asyncapi.info = asyncapi.info || {};
  asyncapi.info.descriptionAsHTML = md.render(asyncapi.info.description || '');

  if (asyncapi.servers) {
    _.each(asyncapi.servers, server => {
      server.descriptionAsHTML = md.render(server.description || '');
      _.each(server.variables, variable => {
        variable.descriptionAsHTML = md.render(variable.description || '');
      });
    });
  }

  if (asyncapi.security) {
    asyncapi._security = [];

    _.each(asyncapi.security, security => {
      const name = Object.keys(security)[0];
      if (!asyncapi.components || !asyncapi.components.securitySchemes || !asyncapi.components.securitySchemes[name]) {
        throw new Error(`Security definition "${name}" is not in included in #/components/securitySchemes.`);
      }

      asyncapi.components.securitySchemes[name].descriptionAsHTML = md.render(asyncapi.components.securitySchemes[name].description || '');
      asyncapi._security.push(asyncapi.components.securitySchemes[name]);
    });
  }

  _.each(asyncapi.topics, (topic, topicName) => {
    const separator = asyncapi['x-topic-separator'] || '.';
    const baseTopic = asyncapi.baseTopic.trim();

    const newTopicName = baseTopic.length ? `${baseTopic}${separator}${topicName}` : topicName;
    if (newTopicName !== topicName) {
      asyncapi.topics[newTopicName] = topic;
      delete asyncapi.topics[topicName];
    }

    if (topic.publish) {
      beautifyMessage(topic.publish);
      if (topic.publish.oneOf) _.each(topic.publish.oneOf, beautifyMessage);
    }

    if (topic.subscribe) {
      beautifyMessage(topic.subscribe);
      if (topic.subscribe.oneOf) _.each(topic.subscribe.oneOf, beautifyMessage);
    }

    if (topic.parameters) {
      topic.parameters.forEach((param) => {
        param.descriptionAsHTML = md.render(param.description || '');
      });
    }
  });

  if (!asyncapi.components) asyncapi.components = {};
  if (!asyncapi.components.messages) {
    asyncapi.__noMessages = true;
    asyncapi.components.messages = {};
  }
  if (!asyncapi.components.schemas) {
    asyncapi.__noSchemas = true;
    asyncapi.components.schemas = {};
  }

  _.each(asyncapi.components.messages, beautifyMessage);

  _.each(asyncapi.components.schemas, (schema, schemaName) => {
    schema = resolveAllOf(schema);
    if (schema.example) {
      schema.formattedExample = stringify(schema.example);
    } else {
      schema.generatedExample = stringify(generateExample(schema));
    }
    asyncapi.components.schemas[schemaName] = schema;
    beautifySchema(schema);
  });

  const commonPrefix = sharedStart(Object.keys(asyncapi.topics));
  const levels = commonPrefix.split('.').length - 1;
  asyncapi.__commonPrefix = commonPrefix.split('.').slice(0, levels).join('.');

  return asyncapi;
};
