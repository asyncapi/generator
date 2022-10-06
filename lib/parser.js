const fs = require('fs');

const { Parser, convertToOldAPI } = require('@asyncapi/parser/cjs');
const { OpenAPISchemaParser } = require('@asyncapi/parser/cjs/schema-parser/openapi-schema-parser');
const { AvroSchemaParser } = require('@asyncapi/parser/cjs/schema-parser/avro-schema-parser');
const { RamlSchemaParser } = require('@asyncapi/parser/cjs/schema-parser/raml-schema-parser');

const parser = module.exports;

const defaultParser = new Parser({ 
  schemaParsers: [
    OpenAPISchemaParser(),
    AvroSchemaParser(),
    RamlSchemaParser(),
  ],
});

parser.getParser = (generator) => {
  if (generator.mapBaseUrlToFolder && generator.mapBaseUrlToFolder.url) {
    return new Parser({ 
      schemaParsers: [
        OpenAPISchemaParser(),
        AvroSchemaParser(),
        RamlSchemaParser(),
      ],
      __unstable: {
        resolver: {
          resolvers: getMapBaseUrlToFolderResolvers(generator.mapBaseUrlToFolder)
        }
      }
    });
  }
  return defaultParser;
};

parser.usesNewAPI = (templateConfig = {}) => {
  return templateConfig.apiVersion === 'v2';
}

parser.getProperApiDocument = (asyncapiDocument, templateConfig) => {
  return parser.usesNewAPI(templateConfig) ? asyncapiDocument : convertToOldAPI(asyncapiDocument);
}

// The new options for the v2 Parser are different from those for the v1 version, but in order not to release Generator v2, we are converting the old options of Parser to the new ones.
parser.convertOldOptionsToNew = (oldOptions, generator) => {
  if (!oldOptions) return;
  const newOptions = {};

  if (typeof oldOptions.path === 'string') {
    newOptions.source = oldOptions.path;
  }
  if (typeof oldOptions.applyTraits === 'boolean') {
    newOptions.applyTraits = oldOptions.applyTraits;
  }

  const resolvers = oldOptions.resolve;
  if (resolvers) {
    const convertedResolvers = convertResolvers(resolvers);
    if (convertedResolvers) {
      let mapBaseResolvers = [];
      if (generator && generator.mapBaseUrlToFolder && generator.mapBaseUrlToFolder.url) {
        mapBaseResolvers = getMapBaseUrlToFolderResolvers(generator.mapBaseUrlToFolder);
      }

      newOptions.__unstable = {};
      newOptions.__unstable.resolver = {
        resolvers: [...mapBaseResolvers, ...convertOldResolvers(resolvers)],
      }
    }
  }

  return newOptions;
}

/**
 * Creates a custom resolver that maps urlToFolder.url to urlToFolder.folder
 * Building your custom resolver is explained here: https://apitools.dev/json-schema-ref-parser/docs/plugins/resolvers.html
 *
 * @private
 * @param  {object} urlToFolder to resolve url e.g. https://schema.example.com/crm/ to a folder e.g. ./test/docs/.
 * @return {{read(*, *, *): Promise<unknown>, canRead(*): boolean, order: number}}
 */
function getMapBaseUrlToFolderResolvers({ url: baseUrl, folder: baseDir }) {
  const resolver = {
    order: 1,
    canRead: true,
    read(uri) {
      const path = uri.toString();
      const localpath = path.replace(baseUrl, baseDir);

      return new Promise(((resolve, reject) => {
        try {
          fs.readFile(localpath, (err, data) => {
            if (err) {
              reject(`Error opening file "${localpath}"`);
            } else {
              resolve(data.toString());
            }
          });
        } catch (err) {
          reject(`Error opening file "${localpath}"`);
        }
      }));
    }
  };

  return [
    { schema: 'http', ...resolver, },
    { schema: 'https', ...resolver, },
  ];
};

function convertOldResolvers(resolvers = {}) {
  if (Object.keys(resolvers).length === 0) return;

  return Object.entries(resolvers).map(([protocol, resolver]) => {
    const canRead = resolver.canRead;

    return {
      schema: protocol,
      order: resolver.order || 0,
      canRead: (uri) => {
        const value = uri.valueOf();
        if (typeof canRead === 'boolean') return canRead;
        if (typeof canRead === 'string') return canRead === value;
        if (Array.isArray(canRead)) return canRead.includes(value);
        if (canRead instanceof RegExp) return canRead.test(value);
        if (typeof canRead === 'function') {
          return canRead({ url: value, extension: uri.suffix() });
        }
        return false;
      },
      read: (uri) => {
        return resolver.read({ url: uri.valueOf(), extension: uri.suffix() });
      }
    }
  });
}
