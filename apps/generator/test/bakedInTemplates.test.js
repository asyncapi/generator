/**
 * @jest-environment node
 */
const path = require('path');
const { listBakedInTemplates, isCoreTemplate, getTemplate } = require('../lib/templates/bakedInTemplates');
const templates = require('../lib/templates/BakedInTemplatesList.json');

describe('bakedInTemplates', () => {
  describe('listBakedInTemplates', () => {
    it('returns all templates when no filter is provided', () => {
      const result = listBakedInTemplates();
      expect(result).toHaveLength(templates.length);
      expect(result).toEqual(templates);
    });

    it('returns all templates when filter is undefined', () => {
      const result = listBakedInTemplates(undefined);
      expect(result).toHaveLength(templates.length);
      expect(result).toEqual(templates);
    });

    it('returns all templates when filter is empty object', () => {
      const result = listBakedInTemplates({});
      expect(result).toHaveLength(templates.length);
      expect(result).toEqual(templates);
    });

    it('filters by type correctly', () => {
      const result = listBakedInTemplates({ type: 'client' });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(t => t.type === 'client')).toBe(true);
    });

    it('returns empty array when type filter matches nothing', () => {
      const result = listBakedInTemplates({ type: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('filters by stack correctly', () => {
      const result = listBakedInTemplates({ stack: 'quarkus' });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(t => t.stack === 'quarkus')).toBe(true);
    });

    it('returns empty array when stack filter matches nothing', () => {
      const result = listBakedInTemplates({ stack: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('filters by protocol correctly', () => {
      const result = listBakedInTemplates({ protocol: 'websocket' });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(t => t.protocol === 'websocket')).toBe(true);
    });

    it('returns empty array when protocol filter matches nothing', () => {
      const result = listBakedInTemplates({ protocol: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('filters by target correctly', () => {
      const result = listBakedInTemplates({ target: 'javascript' });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(t => t.target === 'javascript')).toBe(true);
    });

    it('returns empty array when target filter matches nothing', () => {
      const result = listBakedInTemplates({ target: 'nonexistent' });
      expect(result).toEqual([]);
    });

    it('filters by combined type and protocol', () => {
      const result = listBakedInTemplates({ type: 'client', protocol: 'websocket' });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(t => t.type === 'client' && t.protocol === 'websocket')).toBe(true);
    });

    it('filters by combined type, protocol, and target', () => {
      const result = listBakedInTemplates({ type: 'client', protocol: 'websocket', target: 'javascript' });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(t => 
        t.type === 'client' && 
        t.protocol === 'websocket' && 
        t.target === 'javascript'
      )).toBe(true);
    });

    it('filters by combined type, protocol, target, and stack', () => {
      const result = listBakedInTemplates({ 
        type: 'client', 
        protocol: 'websocket', 
        target: 'java',
        stack: 'quarkus'
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(t => 
        t.type === 'client' && 
        t.protocol === 'websocket' && 
        t.target === 'java' &&
        t.stack === 'quarkus'
      )).toBe(true);
    });

    it('returns empty array when combined filters match nothing', () => {
      const result = listBakedInTemplates({ 
        type: 'client', 
        protocol: 'nonexistent' 
      });
      expect(result).toEqual([]);
    });

    it('handles templates without optional stack property', () => {
      const templatesWithoutStack = templates.filter(t => !t.stack);
      if (templatesWithoutStack.length > 0) {
        const result = listBakedInTemplates({ stack: 'quarkus' });
        // Should not include templates without stack property
        expect(result.every(t => t.stack === 'quarkus')).toBe(true);
      }
    });
  });

  describe('isCoreTemplate', () => {
    it('returns true for existing template name', () => {
      const existingTemplate = templates[0];
      expect(isCoreTemplate(existingTemplate.name)).toBe(true);
    });

    it('returns true for all templates in the list', () => {
      templates.forEach(template => {
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
      const existingTemplate = templates[0];
      const caseVariation = existingTemplate.name.toUpperCase();
      if (caseVariation !== existingTemplate.name) {
        expect(isCoreTemplate(caseVariation)).toBe(false);
      }
    });
  });

  describe('getTemplate', () => {
    it('returns template object with name and path for existing template', async () => {
      const existingTemplate = templates[0];
      const result = await getTemplate(existingTemplate.name);
      
      expect(result).toBeDefined();
      expect(result.name).toBe(existingTemplate.name);
      expect(result.path).toBeDefined();
      expect(typeof result.path).toBe('string');
    });

    it('uses template path when available', async () => {
      const templateWithPath = templates.find(t => t.path);
      if (templateWithPath) {
        const result = await getTemplate(templateWithPath.name);
        expect(result.path).toBe(templateWithPath.path);
      }
    });

    it('falls back to bakedInTemplates directory when path is not provided', async () => {
      const templateWithoutPath = templates.find(t => !t.path);
      if (templateWithoutPath) {
        const result = await getTemplate(templateWithoutPath.name);
        const expectedPath = path.resolve(
          __dirname,
          '../lib/templates/bakedInTemplates',
          templateWithoutPath.name
        );
        expect(result.path).toBe(expectedPath);
      }
    });

    it('handles all templates in the list', async () => {
      for (const template of templates) {
        const result = await getTemplate(template.name);
        expect(result).toBeDefined();
        expect(result.name).toBe(template.name);
        expect(result.path).toBeDefined();
        expect(typeof result.path).toBe('string');
      }
    });

    it('throws error for non-existing template', async () => {
      // Current implementation throws when template.name is accessed on undefined
      await expect(getTemplate('nonexistent-template')).rejects.toThrow();
    });

    it('throws error for empty string template name', async () => {
      // Current implementation will throw when template is not found
      await expect(getTemplate('')).rejects.toThrow();
    });

    it('throws error for null template name', async () => {
      // Current implementation will throw when template is not found
      await expect(getTemplate(null)).rejects.toThrow();
    });

    it('throws error for undefined template name', async () => {
      // Current implementation will throw when template is not found
      await expect(getTemplate(undefined)).rejects.toThrow();
    });
  });
});
