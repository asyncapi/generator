const fs = require('fs');
const path = require('path');
const { sanitizeTemplateApiVersion, usesNewAPI, parse } = require('../lib/parser');
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
});
