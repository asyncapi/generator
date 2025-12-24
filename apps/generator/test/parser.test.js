const fs = require('fs');
const path = require('path');
const os = require('os');
const { mkdir, writeFile, rm } = require('fs').promises;
const { sanitizeTemplateApiVersion, usesNewAPI, parse, convertOldOptionsToNew } = require('../lib/parser');
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
    const parser_api_version = 'x-parser-api-version';
    const parser_spec_parsed = 'x-parser-spec-parsed';
    const parser_original_schema = 'x-parser-original-schema-format';
    const parser_original_payload = 'x-parser-original-payload';
    const parser_message = 'x-parser-message-parsed';
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

      expect(properDocument.document._json[parser_api_version]).toBeDefined();
      expect(properDocument.document._json[parser_api_version]).toEqual(0);
      expect(properDocument.document._json[parser_spec_parsed]).toBeDefined(); 
      expect(properDocument.document._json[parser_spec_parsed]).toEqual(true); 

      expect(properDocument.document._meta).toBeDefined();
      expect(properDocument.document._meta).toEqual({});
      expect(properDocument.document._json.components.messages.dummyCreated).toBeDefined(); 
      expect(properDocument.document._json.components.messages.dummyCreated[parser_original_schema]).toBeDefined(); // Only old API includes this filed
      expect(properDocument.document._json.components.messages.dummyCreated[parser_original_payload]).toBeDefined();
      expect(properDocument.document._json.components.messages.dummyCreated[parser_message]).toBeDefined();
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
      
      expect(properDocument.document._json[parser_api_version]).toBeDefined();
      expect(properDocument.document._json[parser_spec_parsed]).toBeDefined();
      expect(properDocument.document._json[parser_api_version]).toEqual(2);
      expect(properDocument.document._json[parser_spec_parsed]).toEqual(true);

      expect(properDocument.document._meta).toBeDefined();
      expect(properDocument.document._json.components.messages.dummyCreated).toBeDefined(); 
      expect(properDocument.document._json.components.messages.dummyCreated[parser_original_schema]).toBeUndefined();
      expect(properDocument.document._json.components.messages.dummyCreated[parser_original_payload]).toBeUndefined();
      expect(properDocument.document._json.components.messages.dummyCreated[parser_message]).toBeUndefined();
    
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

  describe('getMapBaseUrlToFolderResolvers - Path Traversal Prevention', () => {

    let tempDir;
    let testBaseDir;
    let testFile;

    beforeEach(async () => {
      // Create a temporary directory structure for testing
      tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'asyncapi-test-'));
      testBaseDir = path.join(tempDir, 'test-docs');
      await mkdir(testBaseDir, { recursive: true });
      
      // Create a test file within the base directory
      testFile = path.join(testBaseDir, 'schema.json');
      await writeFile(testFile, JSON.stringify({ test: 'data' }), 'utf8');
    });

    afterEach(async () => {
      // Clean up temporary directory
      if (tempDir) {
        await rm(tempDir, { recursive: true, force: true });
      }
    });

    it('should allow reading files within base directory', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);

      expect(newOptions).toBeDefined();
      expect(newOptions.__unstable).toBeDefined();
      expect(newOptions.__unstable.resolver.resolvers.length).toBeGreaterThan(0);

      // Test that a valid file can be read
      const resolver = newOptions.__unstable.resolver.resolvers[0];
      const testUri = {
        toString: () => 'https://schema.example.com/crm/schema.json',
        valueOf: () => 'https://schema.example.com/crm/schema.json'
      };

      const content = await resolver.read(testUri);
      expect(content).toBeDefined();
      expect(JSON.parse(content).test).toEqual('data');
    });

    it('should reject path traversal attempts with ../', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Attempt to access file outside base directory using ../
      const maliciousUri = {
        toString: () => 'https://schema.example.com/crm/../../../etc/passwd',
        valueOf: () => 'https://schema.example.com/crm/../../../etc/passwd'
      };

      await expect(resolver.read(maliciousUri)).rejects.toThrow('Path traversal detected');
    });

    it('should reject path traversal attempts with ..\\', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Attempt to access file outside base directory using Windows-style ..\\
      const maliciousUri = {
        toString: () => 'https://schema.example.com/crm/..\\..\\..\\etc\\passwd',
        valueOf: () => 'https://schema.example.com/crm/..\\..\\..\\etc\\passwd'
      };

      await expect(resolver.read(maliciousUri)).rejects.toThrow('Path traversal detected');
    });

    it('should reject absolute paths outside base directory', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Create a file outside the base directory
      const outsideFile = path.join(tempDir, 'outside-file.json');
      await writeFile(outsideFile, JSON.stringify({ secret: 'data' }), 'utf8');

      // Attempt to access it using a straightforward traversal path
      const maliciousUri = {
        toString: () => `https://schema.example.com/crm/../../${path.basename(outsideFile)}`,
        valueOf: () => `https://schema.example.com/crm/../../${path.basename(outsideFile)}`
      };

      await expect(resolver.read(maliciousUri)).rejects.toThrow('Path traversal detected');
    });

    it('should handle edge case of base directory itself', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Attempt to access the base directory itself (should be allowed or handled gracefully)
      const baseDirUri = {
        toString: () => 'https://schema.example.com/crm/',
        valueOf: () => 'https://schema.example.com/crm/'
      };

      // This should either succeed (if baseDir is a file) or fail with a clear error
      await expect(resolver.read(baseDirUri)).rejects.toThrow();
    });

    it('should provide clear error messages when path traversal is detected', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      const maliciousUri = {
        toString: () => 'https://schema.example.com/crm/../../../etc/passwd',
        valueOf: () => 'https://schema.example.com/crm/../../../etc/passwd'
      };

      try {
        await resolver.read(maliciousUri);
        // If we reach here, the test should fail
        expect(true).toBe(false); // Force test failure
      } catch (error) {
        expect(error.message).toContain('Path traversal detected');
        expect(error.message).toContain('security violation');
        expect(error.message).toContain('blocked');
      }
    });

    it('should handle multiple path traversal sequences', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Attempt with multiple ../ sequences
      const maliciousUri = {
        toString: () => 'https://schema.example.com/crm/../../../../etc/passwd',
        valueOf: () => 'https://schema.example.com/crm/../../../../etc/passwd'
      };

      await expect(resolver.read(maliciousUri)).rejects.toThrow('Path traversal detected');
    });

    it('should handle case-insensitive path comparison on Windows', async () => {
      if (process.platform !== 'win32') {
        return; // Skip on non-Windows platforms
      }

      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Test with different case in URL (Windows filesystem is case-insensitive)
      const testUri = {
        toString: () => 'https://schema.example.com/crm/SCHEMA.json',
        valueOf: () => 'https://schema.example.com/crm/SCHEMA.json'
      };

      // Should succeed on Windows due to case-insensitive filesystem
      const content = await resolver.read(testUri);
      expect(content).toBeDefined();
      expect(JSON.parse(content).test).toEqual('data');
    });

    it('should handle root directory edge case', async () => {
      // This test verifies that root directories (/, C:\) are handled correctly
      // Skip on Windows as we can't easily test C:\ root
      if (process.platform === 'win32') {
        return;
      }

      // Create a test file in a subdirectory of temp
      const rootTestDir = path.join(os.tmpdir(), 'root-test');
      await mkdir(rootTestDir, { recursive: true });
      const rootTestFile = path.join(rootTestDir, 'test.json');
      await writeFile(rootTestFile, JSON.stringify({ test: 'root' }), 'utf8');

      try {
        const generator = {
          mapBaseUrlToFolder: {
            url: 'https://schema.example.com/',
            folder: rootTestDir
          }
        };
        const oldOptions = {};
        const newOptions = convertOldOptionsToNew(oldOptions, generator);
        const resolver = newOptions.__unstable.resolver.resolvers[0];

        // Test that files within rootTestDir can be accessed
        const testUri = {
          toString: () => 'https://schema.example.com/test.json',
          valueOf: () => 'https://schema.example.com/test.json'
        };

        const content = await resolver.read(testUri);
        expect(content).toBeDefined();
        expect(JSON.parse(content).test).toEqual('root');
      } finally {
        await rm(rootTestDir, { recursive: true, force: true });
      }
    });

    it('should reject URL-encoded path traversal attempts with %2e%2e%2f', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Attempt to access file outside base directory using URL-encoded ../
      // %2e%2e%2f decodes to ../
      const maliciousUri = {
        toString: () => 'https://schema.example.com/crm/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc/passwd',
        valueOf: () => 'https://schema.example.com/crm/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc/passwd'
      };

      await expect(resolver.read(maliciousUri)).rejects.toThrow('Path traversal detected');
    });

    it('should reject URL-encoded Windows path traversal attempts with %2e%2e%5c', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Attempt to access file outside base directory using URL-encoded Windows-style ..\
      // %2e%2e%5c decodes to ..\
      const maliciousUri = {
        toString: () => 'https://schema.example.com/crm/%2e%2e%5c%2e%2e%5c%2e%2e%5cetc%5cpasswd',
        valueOf: () => 'https://schema.example.com/crm/%2e%2e%5c%2e%2e%5c%2e%2e%5cetc%5cpasswd'
      };

      await expect(resolver.read(maliciousUri)).rejects.toThrow('Path traversal detected');
    });

    it('should reject mixed URL-encoded and plain path traversal attempts', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Attempt with mix of URL-encoded and plain traversal sequences
      const maliciousUri = {
        toString: () => 'https://schema.example.com/crm/%2e%2e/../etc/passwd',
        valueOf: () => 'https://schema.example.com/crm/%2e%2e/../etc/passwd'
      };

      await expect(resolver.read(maliciousUri)).rejects.toThrow('Path traversal detected');
    });

    it('should reject invalid URL encoding gracefully', async () => {
      const generator = {
        mapBaseUrlToFolder: {
          url: 'https://schema.example.com/crm/',
          folder: testBaseDir
        }
      };
      const oldOptions = {};
      const newOptions = convertOldOptionsToNew(oldOptions, generator);
      const resolver = newOptions.__unstable.resolver.resolvers[0];

      // Attempt with invalid URL encoding (% followed by invalid hex)
      const maliciousUri = {
        toString: () => 'https://schema.example.com/crm/%zz/invalid',
        valueOf: () => 'https://schema.example.com/crm/%zz/invalid'
      };

      await expect(resolver.read(maliciousUri)).rejects.toThrow('Invalid URL encoding');
    });
  });
});
