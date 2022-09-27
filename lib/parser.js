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

/**
 * Creates a custom resolver that maps urlToFolder.url to urlToFolder.folder
 * Building your custom resolver is explained here: https://apitools.dev/json-schema-ref-parser/docs/plugins/resolvers.html
 *
 * @private
 * @param  {object} urlToFolder to resolve url e.g. https://schema.example.com/crm/ to a folder e.g. ./test/docs/.
 * @return {{read(*, *, *): Promise<unknown>, canRead(*): boolean, order: number}}
 */
getMapBaseUrlToFolderResolvers = ({ url: baseUrl, folder: baseDir }) => {
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
