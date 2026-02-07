const { JavaModelsPresets } = require('../src/ModelsPresets');

describe('ModelsPresets', () => {
  describe('websocketJavaPreset.class.self', () => {
    const websocketPreset = JavaModelsPresets.find(p => p.class);
    const classSelf = websocketPreset.class.self;

    it('adds package and base imports without Map import', () => {
      const result = classSelf({
        content: 'public class Test {}',
        model: { properties: {} }
      });

      expect(result).toContain('package com.asyncapi.models;');
      expect(result).toContain('import java.util.Objects;');
      expect(result).not.toContain('import java.util.Map;');
    });

    it('adds Map import when model contains Map<String, Object>', () => {
      const result = classSelf({
        content: 'public class Test {}',
        model: {
          properties: {
            foo: { property: { type: 'Map<String, Object>' } }
          }
        }
      });

      expect(result).toContain('import java.util.Map;');
    });
  });

  describe('enum and union presets', () => {
    it('adds package for enum', () => {
      const enumPreset = JavaModelsPresets.find(p => p.enum).enum.self;
      const result = enumPreset({ content: 'public enum Test {}' });

      expect(result.startsWith('package com.asyncapi.models;')).toBe(true);
    });
  });
});