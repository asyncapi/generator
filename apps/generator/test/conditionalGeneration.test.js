'use strict';

const { isGenerationConditionMet } = require('../lib/conditionalGeneration');

jest.mock('loglevel', () => ({
  debug: jest.fn(),
}));

jest.mock('../lib/logMessages', () => ({
  relativeSourceFileNotGenerated: jest.fn((path, subject) => `${path} skipped, subject=${subject}`),
  conditionalGenerationMatched: jest.fn((path) => `${path} conditionalGeneration matched`),
  conditionalFilesMatched: jest.fn((path) => `${path} conditionalFiles matched`),
}));

const log = require('loglevel');
const logMessage = require('../lib/logMessages');
const jmespath = require('jmespath');

/**
 * Creates a mock AsyncAPI document.
 * @param {Object} jsonData  - raw JSON returned by doc.json()
 * @param {Object} serverMap - { serverName: rawServerJson } for doc.servers().get()
 */
function makeMockDocument(jsonData = {}, serverMap = {}) {
  return {
    json: jest.fn(() => jsonData),
    servers: jest.fn(() => ({
      get: jest.fn((name) => {
        if (serverMap[name]) {
          return { json: () => serverMap[name] };
        }
        return undefined;
      }),
    })),
  };
}

describe('conditionalGeneration', () => {

  beforeEach(() => jest.clearAllMocks());

  describe('isGenerationConditionMet()', () => {

    // ── subject branch (conditionalGeneration) ──────────────────────────

    describe('when using conditionalGeneration with subject', () => {

      it('should return true when subject resolves and validation passes', async () => {
        const filePath = 'src/api.js';
        const asyncapiDoc = makeMockDocument({ info: { title: 'My API' } });
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              subject: 'info.title',
              validate: (val) => val === 'My API',
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, {}, asyncapiDoc
        );
        expect(result).toBe(true);
      });

      it('should return false when subject resolves but validation fails — covers line 141', async () => {
        const filePath = 'src/api.js';
        const asyncapiDoc = makeMockDocument({ info: { title: 'Wrong Title' } });
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              subject: 'info.title',
              validate: (val) => val === 'My API',
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, {}, asyncapiDoc
        );
        expect(result).toBe(false);
        expect(log.debug).toHaveBeenCalledWith(
          logMessage.conditionalGenerationMatched(filePath)
        );
      });

      it('should return false and log when subject query returns null — covers lines 120-121', async () => {
        const filePath = 'src/mqtt.js';
        const asyncapiDoc = makeMockDocument({ info: { title: 'Test' } });
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              subject: 'channels',   // not present in doc → jmespath returns null
              validate: jest.fn(() => true),
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, {}, asyncapiDoc
        );
        expect(result).toBe(false);
        expect(log.debug).toHaveBeenCalledWith(
          logMessage.relativeSourceFileNotGenerated(filePath, 'channels')
        );
      });

      it('should inject server into JMESPath context when templateParams.server is set — covers line 108', async () => {
        const filePath = 'src/ws.js';
        const serverJson = { protocol: 'ws' };
        const asyncapiDoc = makeMockDocument(
          { info: { title: 'WS API' } },
          { production: serverJson }
        );
        const validateFn = jest.fn((val) => val === 'ws');
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              subject: 'server.protocol',
              validate: validateFn,
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, { server: 'production' }, asyncapiDoc
        );
        expect(result).toBe(true);
        expect(validateFn).toHaveBeenCalledWith('ws');
      });

      it('should return false when server name does not match any server in the document', async () => {
        const filePath = 'src/ws.js';
        const asyncapiDoc = makeMockDocument({ info: { title: 'API' } }, {});
        const validateFn = jest.fn(() => true);
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              subject: 'server.protocol',
              validate: validateFn,
            },
          },
        };

        // 'unknown' not in serverMap → server is undefined → jmespath finds nothing → false
        const result = await isGenerationConditionMet(
          templateConfig, filePath, { server: 'unknown' }, asyncapiDoc
        );
        expect(result).toBe(false);
        expect(validateFn).not.toHaveBeenCalled();
      });

    });

    // ── parameter branch (conditionalGeneration) ────────────────────────

    describe('when using conditionalGeneration with parameter', () => {

      it('should return true when parameter value passes validation', async () => {
        const filePath = 'src/docs/';
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              parameter: 'includeDocs',
              validate: (val) => val === true,
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, { includeDocs: true }, null
        );
        expect(result).toBe(true);
      });

      it('should return false when parameter value fails validation', async () => {
        const filePath = 'src/docs/';
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              parameter: 'includeDocs',
              validate: (val) => val === true,
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, { includeDocs: false }, null
        );
        expect(result).toBe(false);
        expect(log.debug).toHaveBeenCalledWith(
          logMessage.conditionalGenerationMatched(filePath)
        );
      });

      it('should return false when parameter key is absent from templateParams', async () => {
        const filePath = 'src/docs/';
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              parameter: 'includeDocs',
              validate: (val) => val === true,
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, {}, null
        );
        expect(result).toBe(false);
      });

      it('should support enum-style parameter validation', async () => {
        const filePath = 'src/mqtt/';
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              parameter: 'protocol',
              validate: (val) => ['mqtt', 'amqp'].includes(val),
            },
          },
        };

        expect(
          await isGenerationConditionMet(templateConfig, filePath, { protocol: 'mqtt' }, null)
        ).toBe(true);

        expect(
          await isGenerationConditionMet(templateConfig, filePath, { protocol: 'http' }, null)
        ).toBe(false);
      });

    });

    // ── deprecated conditionalFiles branch ──────────────────────────────

    describe('when using deprecated conditionalFiles', () => {

      it('should return true when subject resolves and validation passes', async () => {
        const filePath = 'template/api.js';
        const asyncapiDoc = makeMockDocument({ info: { version: '1.0.0' } });
        const templateConfig = {
          conditionalFiles: {
            [filePath]: {
              subject: 'info.version',
              validate: (val) => val === '1.0.0',
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, {}, asyncapiDoc
        );
        expect(result).toBe(true);
      });

      it('should return false and log conditionalFilesMatched when validation fails', async () => {
        const filePath = 'template/api.js';
        const asyncapiDoc = makeMockDocument({ info: { version: '2.0.0' } });
        const templateConfig = {
          conditionalFiles: {
            [filePath]: {
              subject: 'info.version',
              validate: (val) => val === '1.0.0',
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, {}, asyncapiDoc
        );
        expect(result).toBe(false);
        expect(log.debug).toHaveBeenCalledWith(
          logMessage.conditionalFilesMatched(filePath)
        );
      });

      it('should return false when subject query returns nothing', async () => {
        const filePath = 'template/api.js';
        const asyncapiDoc = makeMockDocument({});
        const templateConfig = {
          conditionalFiles: {
            [filePath]: {
              subject: 'info.version',
              validate: jest.fn(() => true),
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, {}, asyncapiDoc
        );
        expect(result).toBe(false);
        expect(log.debug).toHaveBeenCalledWith(
          logMessage.relativeSourceFileNotGenerated(filePath, 'info.version')
        );
      });

      it('should inject server into JMESPath context via the deprecated path', async () => {
        const filePath = 'template/mqtt.js';
        const serverJson = { protocol: 'mqtt' };
        const asyncapiDoc = makeMockDocument(
          { info: { title: 'MQTT API' } },
          { dev: serverJson }
        );
        const validateFn = jest.fn((val) => val === 'mqtt');
        const templateConfig = {
          conditionalFiles: {
            [filePath]: {
              subject: 'server.protocol',
              validate: validateFn,
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, { server: 'dev' }, asyncapiDoc
        );
        expect(result).toBe(true);
        expect(validateFn).toHaveBeenCalledWith('mqtt');
      });

    });

    // ── edge cases ───────────────────────────────────────────────────────

    describe('edge cases', () => {

      it('should return undefined when config is completely empty', async () => {
        const result = await isGenerationConditionMet({}, 'src/any.js', {}, null);
        expect(result).toBeUndefined();
      });

      it('should return undefined when path does not match any configured entry', async () => {
        const templateConfig = {
          conditionalGeneration: {
            'src/other.js': { parameter: 'flag', validate: () => true },
          },
        };
        const result = await isGenerationConditionMet(
          templateConfig, 'src/unrelated.js', {}, null
        );
        expect(result).toBeUndefined();
      });

      it('should return false when validate function is missing', async () => {
        const filePath = 'src/novalidate.js';
        const asyncapiDoc = makeMockDocument({ info: { title: 'API' } });
        const templateConfig = {
          conditionalGeneration: {
            [filePath]: {
              subject: 'info.title',
              // no validate key
            },
          },
        };

        const result = await isGenerationConditionMet(
          templateConfig, filePath, {}, asyncapiDoc
        );
        expect(result).toBe(false);
      });

      it('should use conditionalFiles path when both conditionalFiles and conditionalGeneration are present', async () => {
          const filePath = 'src/both.js';
          const asyncapiDoc = makeMockDocument({ info: { version: '2.0.0' } });

          const deprecatedValidate = jest.fn((val) => val === '1.0.0'); // returns false for '2.0.0'

          const templateConfig = {
         conditionalFiles: {
          [filePath]: { validate: deprecatedValidate },
          },
         conditionalGeneration: {
         [filePath]: { subject: 'info.version' },
           },
         };

         const result = await isGenerationConditionMet(
         templateConfig, filePath, {}, asyncapiDoc
         );
         expect(result).toBe(false);
         expect(deprecatedValidate).toHaveBeenCalledWith('2.0.0');
         expect(log.debug).toHaveBeenCalledWith(
         logMessage.conditionalFilesMatched(filePath)
         );
        });

    });
  /**
 * Key insight: With the preference for conditionalGeneration, config uses new (with subject).
 * validateStatus() falls back to conditionalFiles.validate since new has no validate.
 * Subject resolves to '2.0.0' → deprecatedValidate('2.0.0') → false.
 * Log uses conditionalGenerationMatched since new config exists.
 */

  // ============================================================================
  // PART 2: Tests for conditionalSubjectGeneration, validateStatus, 
  //         and deprecated functions
  // ============================================================================

  describe('conditionalSubjectGeneration()', () => {
    let mockAsyncAPIDocument;
    let mockTemplateParams;

    beforeEach(() => {
      jest.clearAllMocks();
      const mockGet = jest.fn((serverName) => ({
         json: () => ({ url: 'mqtt://test.mosquitto.org', protocol: 'mqtt' })
      }));

      mockAsyncAPIDocument = {
        json: jest.fn(() => ({
          asyncapi: '2.0.0',
          info: { title: 'Test API', version: '1.0.0' },
          channels: {
           'user/signup': {},
           'user/login': {}
          }
       })),
        servers: jest.fn(() => ({
          get: mockGet         
        }))
      };

      mockTemplateParams = {
        server: 'production',
        customParam: 'testValue'
      };

      jmespath.search = jest.fn();
      log.debug = jest.fn();
    });

    it('should return true when subject is found and no validation function exists', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'channels'
          }
        }
      };

      jmespath.search.mockReturnValue({ 'user/signup': {} });

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      // When there's no validate function, validateStatus returns false
      expect(result).toBe(false);
      expect(jmespath.search).toHaveBeenCalled();
    });

    it('should return true when condition is not specified', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {}
        }
      };

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBeUndefined();
    });

    it('should return false when subject search returns null', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'nonexistent.field',
            validate: jest.fn()
          }
        }
      };

      jmespath.search.mockReturnValue(null);
      logMessage.relativeSourceFileNotGenerated = jest.fn(() => 'file not generated message');

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(false);
      expect(log.debug).toHaveBeenCalled();
      expect(logMessage.relativeSourceFileNotGenerated).toHaveBeenCalledWith(
        'path/to/file',
        'nonexistent.field'
      );
    });

    it('should return false when subject search returns undefined', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'missing.path',
            validate: jest.fn()
          }
        }
      };

      jmespath.search.mockReturnValue(undefined);
      logMessage.relativeSourceFileNotGenerated = jest.fn(() => 'file not generated message');

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(false);
      expect(log.debug).toHaveBeenCalled();
    });

    it('should integrate server data into JMESPath context when server param exists', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'server.protocol',
            validate: jest.fn((protocol) => protocol === 'mqtt')
          }
        }
      };

      jmespath.search.mockReturnValue('mqtt');

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(mockAsyncAPIDocument.servers).toHaveBeenCalled();
      expect(mockGet).toHaveBeenCalledWith('production');
      expect(jmespath.search).toHaveBeenCalledWith(
        expect.objectContaining({
          asyncapi: '2.0.0',
          server: { url: 'mqtt://test.mosquitto.org', protocol: 'mqtt' }
        }),
        'server.protocol'
      );
      expect(result).toBe(true);
    });

    it('should set server to undefined when no server param is provided', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'info.title',
            validate: jest.fn(() => true)
          }
        }
      };

      const paramsWithoutServer = { customParam: 'test' };
      jmespath.search.mockReturnValue('Test API');

      await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        paramsWithoutServer,
        mockAsyncAPIDocument
      );

      expect(jmespath.search).toHaveBeenCalledWith(
        expect.objectContaining({
          server: undefined
        }),
        'info.title'
      );
    });

    it('should work with conditionalFiles (deprecated) configuration', async () => {
      const templateConfig = {
        conditionalFiles: {
          'path/to/file': {
            subject: 'channels',
            validate: jest.fn((channels) => Object.keys(channels).length > 0)
          }
        }
      };

      jmespath.search.mockReturnValue({ 'user/signup': {}, 'user/login': {} });

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(true);
      expect(templateConfig.conditionalFiles['path/to/file'].validate).toHaveBeenCalled();
    });

    it('should pass the search result to validateStatus', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'info',
            validate: jest.fn((info) => info.title === 'Test API')
          }
        }
      };

      const mockInfo = { title: 'Test API', version: '1.0.0' };
      jmespath.search.mockReturnValue(mockInfo);

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(true);
      expect(templateConfig.conditionalGeneration['path/to/file'].validate).toHaveBeenCalledWith(mockInfo);
    });
  });

  describe('validateStatus()', () => {
    let mockTemplateParams;

    beforeEach(() => {
      jest.clearAllMocks();
      mockTemplateParams = { server: 'production' };
      log.debug = jest.fn();
      logMessage.conditionalGenerationMatched = jest.fn(() => 'generation matched message');
      logMessage.conditionalFilesMatched = jest.fn(() => 'files matched message');
    });

    it('should return false when no validation function is provided', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'channels'
          }
        }
      };

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        { json: jest.fn(() => ({})), servers: jest.fn(() => ({ get: jest.fn() })) }
      );

      // When validation is missing, validateStatus returns false
      expect(result).toBe(false);
    });

    it('should return true when validation function returns true', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            parameter: 'testParam',
            validate: jest.fn(() => true)
          }
        }
      };

      mockTemplateParams.testParam = 'testValue';

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        { json: jest.fn(() => ({})), servers: jest.fn(() => ({ get: jest.fn() })) }
      );

      expect(result).toBe(true);
      expect(log.debug).not.toHaveBeenCalled();
    });

    it('should return false and log when validation function returns false', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            parameter: 'testParam',
            validate: jest.fn(() => false)
          }
        }
      };

      mockTemplateParams.testParam = 'testValue';

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        { json: jest.fn(() => ({})), servers: jest.fn(() => ({ get: jest.fn() })) }
      );

      expect(result).toBe(false);
      expect(log.debug).toHaveBeenCalled();
      expect(logMessage.conditionalGenerationMatched).toHaveBeenCalledWith('path/to/file');
    });

    it('should use conditionalFilesMatched log message for deprecated conditionalFiles', async () => {
      const templateConfig = {
        conditionalFiles: {
          'path/to/file': {
            subject: 'channels',
            validate: jest.fn(() => false)
          }
        }
      };

      jmespath.search = jest.fn().mockReturnValue({ someChannel: {} });

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        { json: jest.fn(() => ({})), servers: jest.fn(() => ({ get: jest.fn() })) }
      );

      expect(result).toBe(false);
      expect(log.debug).toHaveBeenCalled();
      expect(logMessage.conditionalFilesMatched).toHaveBeenCalledWith('path/to/file');
    });

    it('should execute validation function with the provided argument', async () => {
      const validationFn = jest.fn((value) => value > 5);
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            parameter: 'numberParam',
            validate: validationFn
          }
        }
      };

      mockTemplateParams.numberParam = 10;

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        { json: jest.fn(() => ({})), servers: jest.fn(() => ({ get: jest.fn() })) }
      );

      expect(result).toBe(true);
      expect(validationFn).toHaveBeenCalledWith(10);
    });

    it('should handle validation function that returns truthy/falsy values', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            parameter: 'testParam',
            validate: jest.fn(() => 'truthy string') // Truthy but not exactly true
          }
        }
      };

      mockTemplateParams.testParam = 'value';

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        { json: jest.fn(() => ({})), servers: jest.fn(() => ({ get: jest.fn() })) }
      );

      expect(result).toBe(true);
    });
  });

  describe('conditionalFilesGenerationDeprecatedVersion()', () => {
    let mockAsyncAPIDocument;
    let mockTemplateParams;

    beforeEach(() => {
      jest.clearAllMocks();
      
      mockAsyncAPIDocument = {
        json: jest.fn(() => ({
          asyncapi: '2.0.0',
          info: { title: 'Test API' }
        })),
        servers: jest.fn(() => ({
          get: jest.fn(() => ({
            json: () => ({ url: 'mqtt://test.mosquitto.org' })
          }))
        }))
      };

      mockTemplateParams = { server: 'production' };
      jmespath.search = jest.fn();
    });

    it('should delegate to conditionalSubjectGeneration when subject is present', async () => {
      const templateConfig = {
        conditionalFiles: {
          'path/to/file': {
            subject: 'info.title',
            validate: jest.fn(() => true)
          }
        }
      };

      jmespath.search.mockReturnValue('Test API');

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(true);
      expect(jmespath.search).toHaveBeenCalled();
    });

    it('should work with validation function in deprecated format', async () => {
      const templateConfig = {
        conditionalFiles: {
          'path/to/file': {
            subject: 'info',
            validate: jest.fn((info) => info.title === 'Test API')
          }
        }
      };

      jmespath.search.mockReturnValue({ title: 'Test API' });

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(true);
      expect(templateConfig.conditionalFiles['path/to/file'].validate).toHaveBeenCalled();
    });

    it('should return false when deprecated conditionalFiles validation fails', async () => {
      const templateConfig = {
        conditionalFiles: {
          'path/to/file': {
            subject: 'info.version',
            validate: jest.fn((version) => version === '2.0.0')
          }
        }
      };

      jmespath.search.mockReturnValue('1.0.0');
      logMessage.conditionalFilesMatched = jest.fn(() => 'deprecated message');

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(false);
      expect(logMessage.conditionalFilesMatched).toHaveBeenCalledWith('path/to/file');
    });
  });

  describe('Integration tests - complex scenarios', () => {
    let mockAsyncAPIDocument;
    let mockTemplateParams;

    beforeEach(() => {
      jest.clearAllMocks();
      
      mockAsyncAPIDocument = {
        json: jest.fn(() => ({
          asyncapi: '2.0.0',
          info: { 
            title: 'E-commerce API',
            version: '1.0.0'
          },
          channels: {
            'order/created': { publish: {} },
            'order/updated': { subscribe: {} },
            'user/registered': { publish: {} }
          },
          servers: {
            production: {
              url: 'mqtt://prod.example.com',
              protocol: 'mqtt'
            }
          }
        })),
        servers: jest.fn(() => ({
          get: jest.fn((name) => {
            if (name === 'production') {
              return {
                json: () => ({
                  url: 'mqtt://prod.example.com',
                  protocol: 'mqtt'
                })
              };
            }
            return null;
          })
        }))
      };

      mockTemplateParams = {
        server: 'production',
        generateDocs: true,
        targetVersion: '3.0'
      };

      jmespath.search = jest.fn();
      log.debug = jest.fn();
    });

    it('should handle complex JMESPath query with nested data', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'channels.*.publish',
            validate: jest.fn((publishOps) => Object.keys(publishOps).length > 0)
          }
        }
      };

      jmespath.search.mockReturnValue({
        'order/created': {},
        'user/registered': {}
      });

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(true);
    });

    it('should handle multiple parameter validations in sequence', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'docs/readme.md': {
            parameter: 'generateDocs',
            validate: jest.fn((val) => val === true)
          },
          'src/v3/index.js': {
            parameter: 'targetVersion',
            validate: jest.fn((ver) => ver.startsWith('3'))
          }
        }
      };

      const result1 = await isGenerationConditionMet(
        templateConfig,
        'docs/readme.md',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      const result2 = await isGenerationConditionMet(
        templateConfig,
        'src/v3/index.js',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('should prioritize conditionalGeneration over deprecated conditionalFiles', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'info.title',
            validate: jest.fn(() => true)
          }
        },
        conditionalFiles: {
          'path/to/file': {
            subject: 'info.version',
            validate: jest.fn(() => false)
          }
        }
      };

      jmespath.search.mockReturnValue('E-commerce API');

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      // Should use conditionalGeneration, not conditionalFiles
      expect(result).toBe(true);
      expect(templateConfig.conditionalGeneration['path/to/file'].validate).toHaveBeenCalled();
      expect(templateConfig.conditionalFiles['path/to/file'].validate).not.toHaveBeenCalled();
    });

    it('should handle scenario where both subject and validation are complex', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'path/to/file': {
            subject: 'channels',
            validate: jest.fn((channels) => {
              const channelNames = Object.keys(channels);
              return channelNames.some(name => name.includes('order'));
            })
          }
        }
      };

      jmespath.search.mockReturnValue({
        'order/created': { publish: {} },
        'order/updated': { subscribe: {} },
        'user/registered': { publish: {} }
      });

      const result = await isGenerationConditionMet(
        templateConfig,
        'path/to/file',
        mockTemplateParams,
        mockAsyncAPIDocument
      );

      expect(result).toBe(true);
      expect(templateConfig.conditionalGeneration['path/to/file'].validate).toHaveBeenCalledWith({
        'order/created': { publish: {} },
        'order/updated': { subscribe: {} },
        'user/registered': { publish: {} }
      });
    });
  
    });
  });

});