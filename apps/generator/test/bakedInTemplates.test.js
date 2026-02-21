/**
 * @jest-environment node
 */
const path = require('path');

jest.mock('../lib/templates/BakedInTemplatesList.json', () => require('./fixtures/bakedInTemplatesFixture.json'));

const { listBakedInTemplates, isCoreTemplate, getTemplate } = require('../lib/templates/bakedInTemplates');
const fixtureTemplates = require('./fixtures/bakedInTemplatesFixture.json');

describe('bakedInTemplates', () => {
  describe('listBakedInTemplates', () => {
    it('returns all templates when no filter is provided', () => {
      const result = listBakedInTemplates();
      expect(result).toHaveLength(fixtureTemplates.length);
      expect(result).toEqual(fixtureTemplates);
    });

    it('returns all templates when filter is undefined', () => {
      const result = listBakedInTemplates(undefined);
      expect(result).toHaveLength(fixtureTemplates.length);
      expect(result).toEqual(fixtureTemplates);
    });

    it('returns all templates when filter is empty object', () => {
      const result = listBakedInTemplates({});
      expect(result).toHaveLength(fixtureTemplates.length);
      expect(result).toEqual(fixtureTemplates);
    });

    it('filters by type correctly', () => {
      const result = listBakedInTemplates({ type: 'client' });
      expect(result).toHaveLength(3);
      expect(result.every(t => t.type === 'client')).toBe(true);
    });

    it('returns empty array when type filter matches nothing', () => {
      const result = listBakedInTemplates({ type: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('filters by stack correctly', () => {
      const result = listBakedInTemplates({ stack: 'quarkus' });
      expect(result).toHaveLength(2);
      expect(result.every(t => t.stack === 'quarkus')).toBe(true);
    });

    it('returns empty array when stack filter matches nothing', () => {
      const result = listBakedInTemplates({ stack: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('filters by protocol correctly', () => {
      const result = listBakedInTemplates({ protocol: 'websocket' });
      expect(result).toHaveLength(2);
      expect(result.every(t => t.protocol === 'websocket')).toBe(true);
    });

    it('returns empty array when protocol filter matches nothing', () => {
      const result = listBakedInTemplates({ protocol: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('filters by target correctly', () => {
      const result = listBakedInTemplates({ target: 'javascript' });
      expect(result).toHaveLength(1);
      expect(result[0].target).toBe('javascript');
    });

    it('returns empty array when target filter matches nothing', () => {
      const result = listBakedInTemplates({ target: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('filters by combined type and protocol', () => {
      const result = listBakedInTemplates({ type: 'client', protocol: 'websocket' });
      expect(result).toHaveLength(2);
      expect(result.every(t => t.type === 'client' && t.protocol === 'websocket')).toBe(true);
    });

    it('filters by combined type, protocol, and target', () => {
      const result = listBakedInTemplates({ type: 'client', protocol: 'websocket', target: 'javascript' });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('fixture-template-client-ws-js');
    });

    it('filters by combined type, protocol, target, and stack', () => {
      const result = listBakedInTemplates({
        type: 'client',
        protocol: 'websocket',
        target: 'java',
        stack: 'quarkus'
      });
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('fixture-template-client-ws-java');
    });

    it('returns empty array when combined filters match nothing', () => {
      const result = listBakedInTemplates({
        type: 'client',
        protocol: 'nonexistent'
      });
      expect(result).toEqual([]);
    });

    it('handles templates without optional stack property', () => {
      const result = listBakedInTemplates({ stack: 'quarkus' });
      expect(result.every(t => t.stack === 'quarkus')).toBe(true);
      expect(result).toHaveLength(2);
    });
  });

  describe('isCoreTemplate', () => {
    it('returns true for existing template name', () => {
      expect(isCoreTemplate('fixture-template-client-ws-js')).toBe(true);
    });

    it('returns true for all templates in the list', () => {
      fixtureTemplates.forEach(template => {
        expect(isCoreTemplate(template.name)).toBe(true);
      });
    });

    it('returns false for non-existing template name', () => {
      expect(isCoreTemplate('nonexistent-template')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isCoreTemplate('')).toBe(false);
    });

    it('returns false for null', () => {
      expect(isCoreTemplate(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isCoreTemplate(undefined)).toBe(false);
    });

    it('is case-sensitive', () => {
      expect(isCoreTemplate('FIXTURE-TEMPLATE-CLIENT-WS-JS')).toBe(false);
    });
  });

  describe('getTemplate', () => {
    it('returns template object with name and path for existing template', async () => {
      const result = await getTemplate('fixture-template-client-ws-js');
      expect(result).toBeDefined();
      expect(result.name).toBe('fixture-template-client-ws-js');
      expect(result.path).toBeDefined();
      expect(typeof result.path).toBe('string');
    });

    it('uses template path when available', async () => {
      const result = await getTemplate('fixture-template-with-path');
      expect(result.path).toBe('/custom/path/to/template');
    });

    it('falls back to bakedInTemplates directory when path is not provided', async () => {
      const result = await getTemplate('fixture-template-client-ws-js');
      const expectedPath = path.resolve(
        __dirname,
        '../lib/templates/bakedInTemplates',
        'fixture-template-client-ws-js'
      );
      expect(result.path).toBe(expectedPath);
    });

    it('handles all templates in the list', async () => {
      for (const template of fixtureTemplates) {
        const result = await getTemplate(template.name);
        expect(result).toBeDefined();
        expect(result.name).toBe(template.name);
        expect(result.path).toBeDefined();
        expect(typeof result.path).toBe('string');
      }
    });

    it('returns undefined for non-existing template', async () => {
      const result = await getTemplate('nonexistent-template');
      expect(result).toBeUndefined();
    });

    it('returns undefined for empty string template name', async () => {
      const result = await getTemplate('');
      expect(result).toBeUndefined();
    });

    it('returns undefined for null template name', async () => {
      const result = await getTemplate(null);
      expect(result).toBeUndefined();
    });

    it('returns undefined for undefined template name', async () => {
      const result = await getTemplate(undefined);
      expect(result).toBeUndefined();
    });
  });
});
