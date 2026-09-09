const { isGenerationConditionMet } = require('../lib/conditionalGeneration');
const { parse } = require('../lib/parser');
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });

const dummyYAML = fs.readFileSync(path.resolve(__dirname, './docs/dummy.yml'), 'utf8');

describe('conditionalGeneration unit tests', () => {
  const testFeaturePath = 'feature/file.js';
  const testUnconditionedPath = 'some/path.js';
  const testSupportDocPath = 'docs/support.html';
  const contactNameSubject = 'info.contact.name';
  const infoTitleSubject = 'info.title';
  const serverProtocolSubject = 'server.protocol';
  const dummyKafkaServer = 'dummy-kafka';

  let asyncapiDocument;

  beforeAll(async () => {
    const { document } = await parse(dummyYAML, {}, { templateConfig: { apiVersion: 'v2' } });
    asyncapiDocument = document;
  });

  it('should return true when no conditional rules are configured', async () => {
    const templateConfig = {};
    const result = await isGenerationConditionMet(
      templateConfig,
      testUnconditionedPath,
      {},
      asyncapiDocument
    );
    expect(result).toBe(true);
  });

  it('should return true when matched path is not in conditional rules', async () => {
    const templateConfig = {
      conditionalGeneration: {
        'other/path.js': {
          parameter: 'generateOther',
          validate: ajv.compile({ const: true })
        }
      }
    };
    const result = await isGenerationConditionMet(
      templateConfig,
      testUnconditionedPath,
      {},
      asyncapiDocument
    );
    expect(result).toBe(true);
  });

  it('should return true when matched path is not in legacy conditionalFiles rules', async () => {
    const templateConfig = {
      conditionalFiles: {
        'other/legacy/path.js': {
          subject: infoTitleSubject,
          validate: ajv.compile({ const: 'Dummy example with all spec features included' })
        }
      }
    };
    const result = await isGenerationConditionMet(
      templateConfig,
      testUnconditionedPath,
      {},
      asyncapiDocument
    );
    expect(result).toBe(true);
  });

  describe('conditionalGeneration - parameter-based condition', () => {
    it('should return true when parameter satisfies validation', async () => {
      const templateConfig = {
        conditionalGeneration: {
          [testFeaturePath]: {
            parameter: 'enableFeature',
            validate: ajv.compile({ const: true })
          }
        }
      };
      const templateParams = { enableFeature: true };
      const result = await isGenerationConditionMet(
        templateConfig,
        testFeaturePath,
        templateParams,
        asyncapiDocument
      );
      expect(result).toBe(true);
    });

    it('should return false when parameter fails validation', async () => {
      const templateConfig = {
        conditionalGeneration: {
          [testFeaturePath]: {
            parameter: 'enableFeature',
            validate: ajv.compile({ const: true })
          }
        }
      };
      const templateParams = { enableFeature: false };
      const result = await isGenerationConditionMet(
        templateConfig,
        testFeaturePath,
        templateParams,
        asyncapiDocument
      );
      expect(result).toBe(false);
    });

    it('should return false when parameter is missing and validation requires it', async () => {
      const templateConfig = {
        conditionalGeneration: {
          [testFeaturePath]: {
            parameter: 'enableFeature',
            validate: ajv.compile({ type: 'boolean', const: true })
          }
        }
      };
      const templateParams = {};
      const result = await isGenerationConditionMet(
        templateConfig,
        testFeaturePath,
        templateParams,
        asyncapiDocument
      );
      expect(result).toBe(false);
    });
  });

  describe('conditionalGeneration - subject-based condition', () => {
    it('should return true when subject query matches document and satisfies validation', async () => {
      const templateConfig = {
        conditionalGeneration: {
          [testSupportDocPath]: {
            subject: contactNameSubject,
            validate: ajv.compile({ const: 'API Support' })
          }
        }
      };
      const result = await isGenerationConditionMet(
        templateConfig,
        testSupportDocPath,
        {},
        asyncapiDocument
      );
      expect(result).toBe(true);
    });

    it('should return false when subject query matches document but fails validation', async () => {
      const templateConfig = {
        conditionalGeneration: {
          [testSupportDocPath]: {
            subject: contactNameSubject,
            validate: ajv.compile({ const: 'Other Team' })
          }
        }
      };
      const result = await isGenerationConditionMet(
        templateConfig,
        testSupportDocPath,
        {},
        asyncapiDocument
      );
      expect(result).toBe(false);
    });

    it('should return false when subject is not found in document', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'docs/nonexistent.html': {
            subject: 'info.nonexistentField',
            validate: ajv.compile({ type: 'string' })
          }
        }
      };
      const result = await isGenerationConditionMet(
        templateConfig,
        'docs/nonexistent.html',
        {},
        asyncapiDocument
      );
      expect(result).toBe(false);
    });

    it('should throw error when subject has malformed JMESPath syntax', async () => {
      const templateConfig = {
        conditionalGeneration: {
          [testSupportDocPath]: {
            subject: 'info.[unclosed',
            validate: ajv.compile({ type: 'string' })
          }
        }
      };
      await expect(
        isGenerationConditionMet(
          templateConfig,
          testSupportDocPath,
          {},
          asyncapiDocument
        )
      ).rejects.toThrow();
    });

    it('should correctly query server when server param is provided', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'kafka/client.js': {
            subject: serverProtocolSubject,
            validate: ajv.compile({ const: 'kafka' })
          }
        }
      };
      const templateParams = { server: dummyKafkaServer };
      const result = await isGenerationConditionMet(
        templateConfig,
        'kafka/client.js',
        templateParams,
        asyncapiDocument
      );
      expect(result).toBe(true);
    });

    it('should return false when queried server protocol does not match validation', async () => {
      const templateConfig = {
        conditionalGeneration: {
          'mqtt/client.js': {
            subject: serverProtocolSubject,
            validate: ajv.compile({ const: 'mqtt' })
          }
        }
      };
      const templateParams = { server: dummyKafkaServer };
      const result = await isGenerationConditionMet(
        templateConfig,
        'mqtt/client.js',
        templateParams,
        asyncapiDocument
      );
      expect(result).toBe(false);
    });
  });

  describe('conditionalFiles (backward compatibility) - subject-based condition', () => {
    const testLegacyPath = 'legacy/file.js';

    it('should return true when legacy conditionalFiles subject satisfies validation', async () => {
      const templateConfig = {
        conditionalFiles: {
          [testLegacyPath]: {
            subject: infoTitleSubject,
            validate: ajv.compile({ const: 'Dummy example with all spec features included' })
          }
        }
      };
      const result = await isGenerationConditionMet(
        templateConfig,
        testLegacyPath,
        {},
        asyncapiDocument
      );
      expect(result).toBe(true);
    });

    it('should return false when legacy conditionalFiles subject fails validation', async () => {
      const templateConfig = {
        conditionalFiles: {
          [testLegacyPath]: {
            subject: infoTitleSubject,
            validate: ajv.compile({ const: 'Different API' })
          }
        }
      };
      const result = await isGenerationConditionMet(
        templateConfig,
        testLegacyPath,
        {},
        asyncapiDocument
      );
      expect(result).toBe(false);
    });

    it('should return false when legacy conditionalFiles subject is not in document', async () => {
      const templateConfig = {
        conditionalFiles: {
          [testLegacyPath]: {
            subject: 'info.unknownProperty',
            validate: ajv.compile({ const: 'val' })
          }
        }
      };
      const result = await isGenerationConditionMet(
        templateConfig,
        testLegacyPath,
        {},
        asyncapiDocument
      );
      expect(result).toBe(false);
    });
  });

  it('should return false when validate function is missing', async () => {
    const templateConfig = {
      conditionalGeneration: {
        'file.js': {
          parameter: 'flag'
        }
      }
    };
    const result = await isGenerationConditionMet(
      templateConfig,
      'file.js',
      { flag: true },
      asyncapiDocument
    );
    expect(result).toBe(false);
  });
});
