const { JavaModelsPresets } = require('../src/ModelsPresets');
const { JAVA_COMMON_PRESET } = require('@asyncapi/modelina');

describe('ModelsPresets', () => {
  describe('JavaModelsPresets structure', () => {
    it('should export JavaModelsPresets as an array', () => {
      expect(Array.isArray(JavaModelsPresets)).toBe(true);
      expect(JavaModelsPresets).toHaveLength(2);
    });

    it('should contain JAVA_COMMON_PRESET with correct options', () => {
      const commonPreset = JavaModelsPresets[0];
      expect(commonPreset.preset).toBe(JAVA_COMMON_PRESET);
      expect(commonPreset.options).toEqual({
        equal: true,
        hashCode: true,
        classToString: true,
        marshalling: false
      });
    });

    it('should contain websocketJavaPreset as second element', () => {
      const websocketPreset = JavaModelsPresets[1];
      expect(websocketPreset).toBeDefined();
      expect(websocketPreset.class).toBeDefined();
      expect(websocketPreset.enum).toBeDefined();
      expect(websocketPreset.union).toBeDefined();
    });
  });

  describe('websocketJavaPreset class.self', () => {
    const websocketPreset = JavaModelsPresets[1];

    it('should add package and basic imports for class without Map properties', () => {
      const mockModel = {
        properties: {
          prop1: { property: { type: 'String' } },
          prop2: { property: { type: 'Integer' } }
        }
      };
      const content = 'public class TestClass {}';
      const result = websocketPreset.class.self({ content, model: mockModel });

      expect(result).toContain('package com.asyncapi.models;');
      expect(result).toContain('import java.util.Objects;');
      expect(result).toContain('public class TestClass {}');
      expect(result).not.toContain('import java.util.Map;');
    });

    it('should add Map import when property type is Map<String, Object>', () => {
      const mockModel = {
        properties: {
          prop1: { property: { type: 'Map<String, Object>' } },
          prop2: { property: { type: 'String' } }
        }
      };
      const content = 'public class TestClass {}';
      const result = websocketPreset.class.self({ content, model: mockModel });

      expect(result).toContain('package com.asyncapi.models;');
      expect(result).toContain('import java.util.Objects;');
      expect(result).toContain('import java.util.Map;');
      expect(result).toContain('public class TestClass {}');
    });

    it('should add Map import only once for multiple Map properties', () => {
      const mockModel = {
        properties: {
          prop1: { property: { type: 'Map<String, Object>' } },
          prop2: { property: { type: 'Map<String, Object>' } },
          prop3: { property: { type: 'Map<String, Object>' } }
        }
      };
      const content = 'public class TestClass {}';
      const result = websocketPreset.class.self({ content, model: mockModel });

      const mapImportCount = (result.match(/import java\.util\.Map;/g) || []).length;
      expect(mapImportCount).toBe(1);
    });

    it('should handle model with no properties', () => {
      const mockModel = { properties: {} };
      const content = 'public class EmptyClass {}';
      const result = websocketPreset.class.self({ content, model: mockModel });

      expect(result).toContain('package com.asyncapi.models;');
      expect(result).toContain('import java.util.Objects;');
      expect(result).toContain('public class EmptyClass {}');
    });
  });

  describe('websocketJavaPreset enum.self', () => {
    const websocketPreset = JavaModelsPresets[1];

    it('should add package declaration to enum content', () => {
      const content = 'public enum Status { ACTIVE, INACTIVE }';
      const result = websocketPreset.enum.self({ content });

      expect(result).toBe('package com.asyncapi.models;\n\npublic enum Status { ACTIVE, INACTIVE }');
    });

    it('should handle empty enum content', () => {
      const content = '';
      const result = websocketPreset.enum.self({ content });

      expect(result).toBe('package com.asyncapi.models;\n\n');
    });
  });

  describe('websocketJavaPreset union.self', () => {
    const websocketPreset = JavaModelsPresets[1];

    it('should add package declaration to union content', () => {
      const content = 'public class UnionType {}';
      const result = websocketPreset.union.self({ content });

      expect(result).toBe('package com.asyncapi.models;\n\npublic class UnionType {}');
    });

    it('should handle empty union content', () => {
      const content = '';
      const result = websocketPreset.union.self({ content });

      expect(result).toBe('package com.asyncapi.models;\n\n');
    });
  });
});
