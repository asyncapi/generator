const fs = require('fs');
const path = require('path');
const { sanitizeTemplateApiVersion, usesNewAPI, parse, getProperApiDocument, convertOldOptionsToNew } = require('../lib/parser');
const dummyV2Document = fs.readFileSync(path.resolve(__dirname, './docs/dummy.yml'), 'utf8');
const dummyV3Document = fs.readFileSync(path.resolve(__dirname, './docs/dummyV3.yml'), 'utf8');

describe('Parser', () => {
  describe('sanitizeTemplateApiVersion', () => {
    it('should return version number when given `v99` syntax', () => {
      const rawVersion = 'v99';
      const expectedVersion = 99;
      const sanitizedVersion = sanitizeTemplateApiVersion(rawVersion);

      expect(sanitizedVersion).toStrictEqual(expectedVersion);
    });
    it('should return version number when given `v1` syntax', () => {
      const rawVersion = 'v1';
      const expectedVersion = 1;
      const sanitizedVersion = sanitizeTemplateApiVersion(rawVersion);

      expect(sanitizedVersion).toStrictEqual(expectedVersion);
    });
    it('should return version number when given `1` syntax', () => {
      const rawVersion = '1';
      const expectedVersion = 1;
      const sanitizedVersion = sanitizeTemplateApiVersion(rawVersion);

      expect(sanitizedVersion).toStrictEqual(expectedVersion);
    });
  });
  describe('usesNewAPI', () => {
    it('should use new parser api if v1', () => {
      const templateConfig = {
        apiVersion: 'v1'
      };
      const isUsingNewAPI = usesNewAPI(templateConfig);

      expect(isUsingNewAPI).toStrictEqual(true);
    });
    it('should use new parser api if v2', () => {
      const templateConfig = {
        apiVersion: 'v2'
      };
      const isUsingNewAPI = usesNewAPI(templateConfig);

      expect(isUsingNewAPI).toStrictEqual(true);
    });
    it('should use new parser api if v3', () => {
      const templateConfig = {
        apiVersion: 'v3'
      };
      const isUsingNewAPI = usesNewAPI(templateConfig);

      expect(isUsingNewAPI).toStrictEqual(true);
    });
    it('should not use new API if no apiVersion', () => {
      const templateConfig = { };
      const isUsingNewAPI = usesNewAPI(templateConfig);

      expect(isUsingNewAPI).toStrictEqual(false);
    });
  });
  describe('parse', () => {
    it('should be able to parse AsyncAPI v2 document for parser API v1', async () => {
      const parsedDocument = await parse(dummyV2Document, {}, {templateConfig: {apiVersion: 'v1'}});

      expect(parsedDocument).toBeDefined();
      expect(parsedDocument.document.version()).toEqual('2.3.0');
    });
    it('should be able to parse AsyncAPI v2 document for parser API v2', async () => {
      const parsedDocument = await parse(dummyV2Document, {}, {templateConfig: {apiVersion: 'v2'}});

      expect(parsedDocument).toBeDefined();
      expect(parsedDocument.document.version()).toEqual('2.3.0');
    });
    it('should be able to parse AsyncAPI v2 document for parser API v3', async () => {
      const parsedDocument = await parse(dummyV2Document, {}, {templateConfig: {apiVersion: 'v3'}});

      expect(parsedDocument).toBeDefined();
      expect(parsedDocument.document.version()).toEqual('2.3.0');
    });
    it('should not be able to parse AsyncAPI v3 document for parser API v1', async () => {
      const parsedDocument = await parse(dummyV3Document, {}, {templateConfig: {apiVersion: 'v1'}});

      expect(parsedDocument).toBeDefined();
      expect(parsedDocument.document).not.toBeDefined();
    });
    it('should not be able to parse AsyncAPI v3 document for old parser', async () => {
      const parsedDocument = await parse(dummyV3Document, {}, {templateConfig: {}});

      expect(parsedDocument).toBeDefined();
      expect(parsedDocument.document).not.toBeDefined();
    });
    it('should be able to parse AsyncAPI v3 document for parser API v2', async () => {
      const parsedDocument = await parse(dummyV3Document, {}, {templateConfig: {apiVersion: 'v2'}});

      expect(parsedDocument).toBeDefined();
      expect(parsedDocument.document.version()).toEqual('3.0.0');
    });
    it('should be able to parse AsyncAPI v3 document for parser API v3', async () => {
      const parsedDocument = await parse(dummyV3Document, {}, {templateConfig: {apiVersion: 'v3'}});
      expect(parsedDocument).toBeDefined();
      expect(parsedDocument.document.version()).toEqual('3.0.0');
    });
  });
  
  describe('getProperApiDocument', () => {
    it('should convert to old API if apiVersion is undefined', async () => {
      // parse calls the get properAPIDocument and returns it along with a diagnostic in a Object
      // so its like called the get properAPIDocument function and then returned the result
      const templateConfig = {};
      const properDocument = await parse(dummyV2Document, {}, { templateConfig }); 

      // Validate that properDocument convert it to expected API version from the template
      expect(properDocument).toBeDefined();

      expect(properDocument).toBeDefined();
      expect(properDocument.document._json).toBeDefined();
      expect(properDocument.document._json.asyncapi).toEqual('2.3.0');
      expect(properDocument.diagnostics).toBeDefined();
      expect(properDocument.diagnostics.length).toBeGreaterThan(0);

      expect(properDocument.document._json['x-parser-api-version']).toBeDefined();
      expect(properDocument.document._json['x-parser-api-version']).toEqual(0);
      expect(properDocument.document._json['x-parser-spec-parsed']).toBeDefined(); 
      expect(properDocument.document._json['x-parser-spec-parsed']).toEqual(true); 

      expect(properDocument.document._meta).toBeDefined();
      expect(properDocument.document._meta).toEqual({});
      expect(properDocument.document._json.components.messages.dummyCreated).toBeDefined(); 
      expect(properDocument.document._json.components.messages.dummyCreated['x-parser-original-schema-format']).toBeDefined(); // Only old API includes this filed
      expect(properDocument.document._json.components.messages.dummyCreated['x-parser-original-payload']).toBeDefined();
      expect(properDocument.document._json.components.messages.dummyCreated['x-parser-message-parsed']).toBeDefined();
    });

    it('should convert to specified API version', async () => {
      const templateConfig = { apiVersion: 'v2' };
      const properDocument = await parse(dummyV2Document, {}, { templateConfig });

      // Validate that properDocument is defined
      expect(properDocument).toBeDefined();

      // Validate that the document is converted to the specified API version
      expect(properDocument.document._json.asyncapi).toEqual('2.3.0');
      expect(properDocument.diagnostics).toBeDefined();
      expect(properDocument.diagnostics.length).toBeGreaterThan(0);
      
      expect(properDocument.document._json['x-parser-api-version']).toBeDefined();
      expect(properDocument.document._json['x-parser-spec-parsed']).toBeDefined();
      expect(properDocument.document._json['x-parser-api-version']).toEqual(2);
      expect(properDocument.document._json['x-parser-spec-parsed']).toEqual(true);

      expect(properDocument.document._meta).toBeDefined();
      expect(properDocument.document._json.components.messages.dummyCreated).toBeDefined(); 
      expect(properDocument.document._json.components.messages.dummyCreated['x-parser-original-schema-format']).toBeUndefined(); 
      expect(properDocument.document._json.components.messages.dummyCreated['x-parser-original-payload']).toBeUndefined();
      expect(properDocument.document._json.components.messages.dummyCreated['x-parser-message-parsed']).toBeUndefined();
    
      // Validate that old API-specific functions and properties are not present
      expect(properDocument.oldApiSpecificFunction).toBeUndefined();
      expect(properDocument.oldApiSpecificProperty).toBeUndefined();
      expect(properDocument.anotherOldApiFunction).toBeUndefined();
    });
  });

  describe('convertOldOptionsToNew', () => {
    it('should convert old options to new options', () => {
      const oldOptions = {
        path: './test/docs/',
        applyTraits: true,
        resolve: {
          http: {
            order: 1,
            canRead: true,
            read: jest.fn()
          }
        }
      };
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: './test/docs/'
        }
      };
      const newOptions = convertOldOptionsToNew(oldOptions, generator);

      expect(newOptions).toBeDefined();
      expect(newOptions.source).toEqual(oldOptions.path);
      expect(newOptions.applyTraits).toEqual(oldOptions.applyTraits);
      expect(newOptions.__unstable).toBeDefined();
      expect(newOptions.__unstable.resolver.resolvers.length).toBeGreaterThan(0);
    });

    it('should return undefined if oldOptions is not provided', () => {
      const newOptions = convertOldOptionsToNew(undefined, {});

      expect(newOptions).toBeUndefined();
    });
  });
});
