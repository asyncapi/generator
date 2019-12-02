module.exports = ({ Nunjucks, _ }) => {
  Nunjucks.addFilter('camelCase', (str) => {
    return _.camelCase(str);
  });

  Nunjucks.addFilter('upperFirst', (str) => {
    return _.upperFirst(str);
  });

  Nunjucks.addFilter('schemeExists', (collection, scheme) => {
    return _.some(collection, {'scheme': scheme});
  });

  Nunjucks.addFilter('publishMethodName', (channel) => {
    return 'publish' + _.upperFirst(channel.publish().id());
  });

  Nunjucks.addFilter('handlerMethodName', (channel) => {
    return 'handle' + _.upperFirst(channel.subscribe().id());
  });

  Nunjucks.addFilter('publishChannels', (asyncapi) => {
    const publishMap = {};
    _.entries(asyncapi.channels()).forEach(entry => {
      if (entry[1].hasPublish()) {
        publishMap[entry[0]] = entry[1];
      }
    });
    return publishMap;
  });

  Nunjucks.addFilter('subscribeChannels', (asyncapi) => {
    const subscribeMap = {};
    _.entries(asyncapi.channels()).forEach(entry => {
      if (entry[1].hasSubscribe()) {
        subscribeMap[entry[0]] = entry[1];
      }
    });
    return subscribeMap;
  });
};
