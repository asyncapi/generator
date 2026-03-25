/**
 * Comprehensive unit tests for lib/conditionalGeneration.js
    * Focuses on the isGenerationConditionMet function which determines whether a given file path should be generated based on the template configuration and AsyncAPI document.    * Covers various scenarios including parameter-based conditions, subject-based conditions using JMESPath, and the deprecated conditionalFiles API.
    * Mocks loglevel and logMessages to verify correct logging behavior for matched conditions and not-generated cases.             
 */

'use strict';

const log = require('loglevel');
const logMessage = require('../lib/logMessages');
const { isGenerationConditionMet } = require('../lib/conditionalGeneration');

jest.mock('loglevel');
jest.mock('../lib/logMessages', () => ({
  relativeSourceFileNotGenerated: jest.fn((path, subject) => `${path} not generated: ${subject}`),
  conditionalGenerationMatched: jest.fn((path) => `conditionalGeneration matched: ${path}`),
  conditionalFilesMatched: jest.fn((path) => `conditionalFiles matched: ${path}`),
}));
/**
 * Build a minimal templateConfig with conditionalGeneration entries.
 *
 * @param {string} path          - The matched condition path key
 * @param {object} conditionOpts - Any subset of { subject, parameter, validate }
 */
function makeConditionalGenerationConfig(path, conditionOpts) {
  return {
    conditionalGeneration: {
      [path]: conditionOpts,
    },
  };
}

/**
 * Build a minimal templateConfig with conditionalFiles (deprecated API).
 */
function makeConditionalFilesConfig(path, conditionOpts) {
  return {
    conditionalFiles: {
      [path]: conditionOpts,
    },
  };
}
function makeAsyncapiDocument(jsonData = {}, serverData = null) {
  return {
    json: jest.fn(() => jsonData),
    servers: jest.fn(() => ({
      get: jest.fn(() => serverData ? { json: jest.fn(() => serverData) } : undefined),
    })),
  };
}
describe('isGenerationConditionMet', () => {
  const PATH = 'some/file.txt';

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('when no matching config exists for the given path', () => {
    it('returns undefined when both conditionalGeneration and conditionalFiles are absent', async () => {
      const result = await isGenerationConditionMet({}, PATH, {}, makeAsyncapiDocument());
      expect(result).toBeUndefined();
    });

    it('returns undefined when the path key is not present in conditionalGeneration', async () => {
      const config = makeConditionalGenerationConfig('other/path.txt', { validate: () => true });
      const result = await isGenerationConditionMet(config, PATH, {}, makeAsyncapiDocument());
      expect(result).toBeUndefined();
    });
  });
  describe('conditionalParameterGeneration path (conditionalGeneration, no subject)', () => {
    it('returns true when the parameter value passes the validate function', async () => {
      const config = makeConditionalGenerationConfig(PATH, {
        parameter: 'myParam',
        validate: (val) => val === 'enabled',
      });
      const result = await isGenerationConditionMet(config, PATH, { myParam: 'enabled' }, makeAsyncapiDocument());
      expect(result).toBe(true);
    });

    it('returns false when the parameter value fails the validate function', async () => {
      const config = makeConditionalGenerationConfig(PATH, {
        parameter: 'myParam',
        validate: (val) => val === 'enabled',
      });
      const result = await isGenerationConditionMet(config, PATH, { myParam: 'disabled' }, makeAsyncapiDocument());
      expect(result).toBe(false);
    });

    it('returns false (and logs) when parameter value fails validate', async () => {
      const config = makeConditionalGenerationConfig(PATH, {
        parameter: 'myParam',
        validate: () => false,
      });
      await isGenerationConditionMet(config, PATH, { myParam: 'anything' }, makeAsyncapiDocument());
      expect(log.debug).toHaveBeenCalledWith(logMessage.conditionalGenerationMatched(PATH));
    });

    it('returns false when validate function is missing (no subject, no validate)', async () => {
      // validateStatus is called with a parameter value but no validate fn → false
      const config = makeConditionalGenerationConfig(PATH, {
        parameter: 'myParam',
      });
      const result = await isGenerationConditionMet(config, PATH, { myParam: 'anything' }, makeAsyncapiDocument());
      expect(result).toBe(false);
    });

    it('returns false when parameter is present but undefined in templateParams', async () => {
      const config = makeConditionalGenerationConfig(PATH, {
        parameter: 'undefinedParam',
        validate: (val) => val !== undefined,
      });
      const result = await isGenerationConditionMet(config, PATH, {}, makeAsyncapiDocument());
      expect(result).toBe(false);
    });

    it('passes the correct parameter value to validate', async () => {
      const validateMock = jest.fn(() => true);
      const config = makeConditionalGenerationConfig(PATH, {
        parameter: 'serverName',
        validate: validateMock,
      });
      await isGenerationConditionMet(config, PATH, { serverName: 'production' }, makeAsyncapiDocument());
      expect(validateMock).toHaveBeenCalledWith('production');
    });
  });
  describe('conditionalSubjectGeneration path (conditionalGeneration with subject)', () => {
    it('returns true when jmespath finds a value that passes validate', async () => {
      const doc = makeAsyncapiDocument({ info: { title: 'My API' } });
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'info.title',
        validate: (val) => val === 'My API',
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(true);
    });

    it('returns false (and logs not-generated) when jmespath returns null', async () => {
      const doc = makeAsyncapiDocument({});
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'info.title',
        validate: () => true,
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
      expect(log.debug).toHaveBeenCalledWith(logMessage.relativeSourceFileNotGenerated(PATH, 'info.title'));
    });

    it('returns false when jmespath finds a value but validate returns false', async () => {
      const doc = makeAsyncapiDocument({ info: { title: 'Wrong API' } });
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'info.title',
        validate: (val) => val === 'My API',
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
    });

    it('returns false when validate is missing even though subject resolves', async () => {
      const doc = makeAsyncapiDocument({ info: { title: 'My API' } });
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'info.title',
        // no validate
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
    });

    it('merges templateParams.server into the JMESPath search object when server is found', async () => {
      const serverData = { url: 'https://my.server.com', protocol: 'https' };
      const doc = makeAsyncapiDocument({ info: {} }, serverData);
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'server.protocol',
        validate: (val) => val === 'https',
      });
      const result = await isGenerationConditionMet(config, PATH, { server: 'myServer' }, doc);
      expect(result).toBe(true);
      // Confirm asyncapiDocument.servers().get() was called with the server param
      expect(doc.servers().get).toHaveBeenCalledWith('myServer');
    });

    it('sets server to undefined in JMESPath object when templateParams.server is not found in document', async () => {
      const doc = makeAsyncapiDocument({ info: {} }, null /* no server found */);
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'server.protocol',
        validate: (val) => val === 'https',
      });
      const result = await isGenerationConditionMet(config, PATH, { server: 'missingServer' }, doc);
      expect(result).toBe(false);
    });

    it('does not include server key when templateParams.server is absent', async () => {
      const doc = makeAsyncapiDocument({ channels: { '/user': {} } });
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'channels."/user"',
        validate: (val) => !!val,
      });
      // No server param in templateParams → server branch skipped
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(true);
    });

    it('searches deep nested AsyncAPI fields via JMESPath', async () => {
      const doc = makeAsyncapiDocument({
        components: { schemas: { User: { type: 'object' } } },
      });
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'components.schemas.User.type',
        validate: (val) => val === 'object',
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(true);
    });

    it('handles a JMESPath expression returning an empty array as falsy (no source)', async () => {
      const doc = makeAsyncapiDocument({ servers: [] });
      const config = makeConditionalGenerationConfig(PATH, {
        subject: 'servers[0]',
        validate: () => true,
      });
      // jmespath returns undefined/null for out-of-bounds → treated as falsy
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
    });
  });
  // Deprecated conditionalFiles path
  describe('deprecated conditionalFiles path (with subject)', () => {
    it('returns true when conditionalFiles subject resolves and validate passes', async () => {
      const doc = makeAsyncapiDocument({ info: { version: '1.0.0' } });
      const config = makeConditionalFilesConfig(PATH, {
        subject: 'info.version',
        validate: (val) => val === '1.0.0',
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(true);
    });

    it('returns false when conditionalFiles subject is not found in document', async () => {
      const doc = makeAsyncapiDocument({});
      const config = makeConditionalFilesConfig(PATH, {
        subject: 'info.nonexistent',
        validate: () => true,
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
    });

    it('returns false when validate fails in conditionalFiles path and logs deprecated message', async () => {
      const doc = makeAsyncapiDocument({ info: { title: 'Test' } });
      const config = makeConditionalFilesConfig(PATH, {
        subject: 'info.title',
        validate: () => false,
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
      expect(log.debug).toHaveBeenCalledWith(logMessage.conditionalFilesMatched(PATH));
    });

    it('prefers conditionalFiles over conditionalGeneration when both are defined for the same path and conditionalFiles has subject', async () => {
      const doc = makeAsyncapiDocument({ info: { title: 'Test' } });
      const config = {
        conditionalFiles: {
          [PATH]: { subject: 'info.title', validate: (val) => val === 'Test' },
        },
        conditionalGeneration: {
          [PATH]: { parameter: 'myParam', validate: () => false },
        },
      };
      const result = await isGenerationConditionMet(config, PATH, { myParam: 'yes' }, doc);
      expect(result).toBe(true);
    });

    it('returns false when conditionalFiles validate is missing (silent false)', async () => {
      const doc = makeAsyncapiDocument({ info: { title: 'Test' } });
      const config = makeConditionalFilesConfig(PATH, {
        subject: 'info.title',
        // no validate
      });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
    });

    it('merges templateParams.server into JMESPath object for deprecated conditionalFiles path', async () => {
      const serverData = { protocol: 'mqtt' };
      const doc = makeAsyncapiDocument({}, serverData);
      const config = makeConditionalFilesConfig(PATH, {
        subject: 'server.protocol',
        validate: (val) => val === 'mqtt',
      });
      const result = await isGenerationConditionMet(config, PATH, { server: 'broker' }, doc);
      expect(result).toBe(true);
    });
  });

  // validateStatus – missing validate function (the "silent false" bug guard)
  // 
  describe('validateStatus – missing validate function', () => {
    it('returns false silently when validate is missing on a conditionalGeneration parameter path', async () => {
      const config = makeConditionalGenerationConfig(PATH, { parameter: 'flag' });
      const result = await isGenerationConditionMet(config, PATH, { flag: 'true' }, makeAsyncapiDocument());
      expect(result).toBe(false);
      // Should NOT log a "matched" message because validation was never defined
      expect(log.debug).not.toHaveBeenCalled();
    });

    it('returns false silently when validate is missing on a conditionalGeneration subject path', async () => {
      const doc = makeAsyncapiDocument({ info: { title: 'x' } });
      const config = makeConditionalGenerationConfig(PATH, { subject: 'info.title' });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
      expect(log.debug).not.toHaveBeenCalled();
    });

    it('returns false silently when validate is missing on a deprecated conditionalFiles subject path', async () => {
      const doc = makeAsyncapiDocument({ info: { title: 'x' } });
      const config = makeConditionalFilesConfig(PATH, { subject: 'info.title' });
      const result = await isGenerationConditionMet(config, PATH, {}, doc);
      expect(result).toBe(false);
      expect(log.debug).not.toHaveBeenCalled();
    });
  });

});