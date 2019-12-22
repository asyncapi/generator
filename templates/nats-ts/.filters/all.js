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

  Nunjucks.addFilter('fileName', string => {
    return _.camelCase(string);
  });

  Nunjucks.addFilter('oneLine', string => {
    if (!string) return string;
    return string.replace(/\n/g, ' ');
  });

  Nunjucks.addFilter('containsTag', (array, tag) => {
    if (!array || !tag) {
      return false;
    }
    return array.find(value => {
      return tag === value.name();
    });
  });

  Nunjucks.addFilter('docline', (field, fieldName, scopePropName) => {
    const buildLine = (f, fName, pName) => {
      const type = f.type() ? f.type() : 'string';
      const description = f.description()
        ? ` - ${f.description().replace(/\r?\n|\r/g, '')}`
        : '';
      let def = f.default();

      if (def && type === 'string') def = `'${def}'`;

      let line;
      if (def !== undefined) {
        line = ` * @param {${type}} [${
          pName ? `${pName}.` : ''
          }${fName}=${def}]`;
      } else {
        line = ` * @param {${type}} ${pName ? `${pName}.` : ''}${fName}`;
      }

      if (type === 'object') {
        let lines = `${line}\n`;
        let first = true;
        for (const propName in f.properties()) {
          lines = `${lines}${first ? '' : '\n'}${buildLine(
            f.properties()[propName],
            propName,
            `${pName ? `${pName}.` : ''}${fName}`
          )}`;
          first = false;
        }
        return lines;
      }

      return `${line}${description}`;
    };

    return buildLine(field, fieldName, scopePropName);
  });

  Nunjucks.addFilter('port', (url, defaultPort) => {
    const parsed = URL.parse(url);
    return parsed.port || defaultPort || 80;
  });

  Nunjucks.addFilter('pathResolve', (pathName, basePath = '/') => {
    return path.resolve(basePath, pathName);
  });

  Nunjucks.addFilter('hasNatsBindings', obj => {
    try {
      let tempObj = obj._json;
      return tempObj.bindings && tempObj.bindings.nats ? true : false;
    } catch (e) {
      throw new Error("Could not find ts payload: " + e);
    }
  });

  Nunjucks.addFilter('tsPayload', server => {
    try {
      let tempServer = server._json;
      return tempServer.bindings && tempServer.bindings.nats && tempServer.bindings.nats.payload ? tempServer.bindings.nats.payload.toUpperCase() : 'STRING';
    } catch (e) {
      throw new Error("Could not find ts payload: " + e);
    }
  });

  Nunjucks.addFilter('tsEncoding', server => {
    let tempServer = server._json;
    let tempEncoding = tempServer.bindings && tempServer.bindings.nats && tempServer.bindings.nats.payload ? tempServer.bindings.nats.encoding : 'utf8';
    switch (tempEncoding) {
      case 'utf8':
        return 'utf8';
      case 'utf16le':
        return 'utf16le';
      case 'ascii':
        return 'ascii';
      case 'ucs2':
        return 'ucs2';
      case 'base64':
        return 'base64';
      case 'latin1':
        return 'latin1';
      case 'binary':
        return 'binary';
      case 'hex':
        return 'hex';
      default:
        return 'utf8';
    }
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


  Nunjucks.addFilter('print', obj => {
    console.log(JSON.stringify(obj, null, 4));
  });

  Nunjucks.addFilter('throw', message => {
    throw new Error(message);
  });
};
