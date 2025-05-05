const fs = require('fs');
const { convertToOldAPI } = require('@asyncapi/parser');
const { ConvertDocumentParserAPIVersion, NewParser } = require('@asyncapi/multi-parser');

const parser = module.exports;

parser.sanitizeTemplateApiVersion = (apiVersion) => {
  if (!apiVersion) return;
  if (apiVersion && apiVersion.length > 1) {
    return Number(apiVersion.substring(1));
  }
  return Number(apiVersion);
};

parser.parse = async function(asyncapi, oldOptions, generator) {
  let apiVersion = this.sanitizeTemplateApiVersion(generator.templateConfig.apiVersion);

  if (!this.usesNewAPI(generator.templateConfig)) {
    apiVersion = 1;
  }

  const options = convertOldOptionsToNew(oldOptions, generator);
  const parserInstance = NewParser(apiVersion, {
    parserOptions: options,
    includeSchemaParsers: true
  });

  const { document, diagnostics } = await parserInstance.parse(asyncapi, options);

  if (!document) {
    return { document, diagnostics };
  }

  // 🔁 AsyncAPI v3 already returns fully dereferenced document
  return {
    document: this.getProperApiDocument(document, generator.templateConfig),
    diagnostics
  };
};

parser.usesNewAPI = function(templateConfig = {}) {
  return this.sanitizeTemplateApiVersion(templateConfig.apiVersion) > 0;
};

parser.getProperApiDocument = function(asyncapiDocument, templateConfig = {}) {
  const apiVersion = this.sanitizeTemplateApiVersion(templateConfig.apiVersion);
  if (apiVersion === undefined) {
    return convertToOldAPI(asyncapiDocument);
  }
  return ConvertDocumentParserAPIVersion(asyncapiDocument, apiVersion);
};

function convertOldOptionsToNew(oldOptions, generator) {
  if (!oldOptions) return;
  const newOptions = {};

  if (typeof oldOptions.path === 'string') {
    newOptions.source = oldOptions.path;
  }
  if (typeof oldOptions.applyTraits === 'boolean') {
    newOptions.applyTraits = oldOptions.applyTraits;
  }

  const resolvers = [];
  if (generator?.mapBaseUrlToFolder?.url) {
    resolvers.push(...getMapBaseUrlToFolderResolvers(generator.mapBaseUrlToFolder));
  }
  if (oldOptions.resolve) {
    resolvers.push(...convertOldResolvers(oldOptions.resolve));
  }

  if (resolvers.length) {
    newOptions.__unstable = {};
    newOptions.__unstable.resolver = { resolvers };
  }

  return newOptions;
}

function getMapBaseUrlToFolderResolvers({ url: baseUrl, folder: baseDir }) {
  const resolver = {
    order: 1,
    canRead: true,
    read(uri) {
      return new Promise((resolve, reject) => {
        const path = uri.toString();
        const localpath = path.replace(baseUrl, baseDir);
        try {
          fs.readFile(localpath, (err, data) => {
            if (err) reject(`Error opening file "${localpath}"`);
            else resolve(data.toString());
          });
        } catch (err) {
          reject(`Error opening file "${localpath}"`);
        }
      });
    }
  };

  return [
    { schema: 'http', ...resolver },
    { schema: 'https', ...resolver }
  ];
}

function convertOldResolvers(resolvers = {}) {
  if (Object.keys(resolvers).length === 0) return [];

  return Object.entries(resolvers).map(([protocol, resolver]) => {
    return {
      schema: protocol,
      order: resolver.order || 1,
      canRead: (uri) => canReadFn(uri, resolver.canRead),
      read: (uri) => {
        return resolver.read({ url: uri.valueOf(), extension: uri.suffix() });
      }
    };
  });
}

function canReadFn(uri, canRead) {
  const value = uri.valueOf();
  if (typeof canRead === 'boolean') return canRead;
  if (typeof canRead === 'string') return canRead === value;
  if (Array.isArray(canRead)) return canRead.includes(value);
  if (canRead instanceof RegExp) return canRead.test(value);
  if (typeof canRead === 'function') {
    return canRead({ url: value, extension: uri.suffix() });
  }
  return false;
}
