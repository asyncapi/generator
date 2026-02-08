const { JavaModelsPresets } = require('../src/ModelsPresets');
const { JAVA_COMMON_PRESET } = require('@asyncapi/modelina');

const PACKAGE_DECLARATION = 'package com.asyncapi.models;';
const IMPORT_OBJECTS = 'import java.util.Objects;';
const IMPORT_MAP = 'import java.util.Map;';
const TEST_CLASS_CONTENT = 'public class TestClass {}';
const MAP_STRING_OBJECT_TYPE = 'Map<String, Object>';
const PACKAGE_WITH_NEWLINES = 'package com.asyncapi.models;\n\n';

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
      const result = websocketPreset.class.self({ content: TEST_CLASS_CONTENT, model: mockModel });

      expect(result).toContain(PACKAGE_DECLARATION);
      expect(result).toContain(IMPORT_OBJECTS);
      expect(result).toContain(TEST_CLASS_CONTENT);
      expect(result).not.toContain(IMPORT_MAP);
    });

    it('should add Map import when property type is Map<String, Object>', () => {
      const mockModel = {
        properties: {
          prop1: { property: { type: MAP_STRING_OBJECT_TYPE } },
          prop2: { property: { type: 'String' } }
        }
      };
      const result = websocketPreset.class.self({ content: TEST_CLASS_CONTENT, model: mockModel });

      expect(result).toContain(PACKAGE_DECLARATION);
      expect(result).toContain(IMPORT_OBJECTS);
      expect(result).toContain(IMPORT_MAP);
      expect(result).toContain(TEST_CLASS_CONTENT);
    });

    it('should add Map import only once for multiple Map properties', () => {
      const mockModel = {
        properties: {
          prop1: { property: { type: MAP_STRING_OBJECT_TYPE } },
          prop2: { property: { type: MAP_STRING_OBJECT_TYPE } },
          prop3: { property: { type: MAP_STRING_OBJECT_TYPE } }
        }
      };
      const result = websocketPreset.class.self({ content: TEST_CLASS_CONTENT, model: mockModel });

      const mapImportCount = (result.match(/import java\.util\.Map;/g) || []).length;
      expect(mapImportCount).toBe(1);
    });

    it('should handle model with no properties', () => {
      const mockModel = { properties: {} };
      const content = 'public class EmptyClass {}';
      const result = websocketPreset.class.self({ content, model: mockModel });

      expect(result).toContain(PACKAGE_DECLARATION);
      expect(result).toContain(IMPORT_OBJECTS);
      expect(result).toContain('public class EmptyClass {}');
    });
  });

  describe('websocketJavaPreset enum.self', () => {
    const websocketPreset = JavaModelsPresets[1];

    it('should add package declaration to enum content', () => {
      const content = 'public enum Status { ACTIVE, INACTIVE }';
      const result = websocketPreset.enum.self({ content });

      expect(result).toBe(`${PACKAGE_WITH_NEWLINES}public enum Status { ACTIVE, INACTIVE }`);
    });

    it('should handle empty enum content', () => {
      const content = '';
      const result = websocketPreset.enum.self({ content });

      expect(result).toBe(PACKAGE_WITH_NEWLINES);
    });
  });

  describe('websocketJavaPreset union.self', () => {
    const websocketPreset = JavaModelsPresets[1];

    it('should add package declaration to union content', () => {
      const content = 'public class UnionType {}';
      const result = websocketPreset.union.self({ content });

      expect(result).toBe(`${PACKAGE_WITH_NEWLINES}public class UnionType {}`);
    });

    it('should handle empty union content', () => {
      const content = '';
      const result = websocketPreset.union.self({ content });

      expect(result).toBe(PACKAGE_WITH_NEWLINES);
    });
  });
});
