import { JAVA_COMMON_PRESET } from '@asyncapi/modelina';
import { Models } from '@asyncapi/generator-components';

// Helper function to add package declaration
function addPackage(content) {
  return `package com.asyncapi.models;\n\n${content}`;
}

export default async function({ asyncapi }) {
  const websocketJavaPreset = {
    class: {
      self({ content, model }) {
        // Solution to handle imports dynamically
        const requiredImports = new Set();
        requiredImports.add('import java.util.Objects;');
        Object.values(model.properties).forEach(property => {
          const type = property.property.type;

          if (type === 'Map<String, Object>') {
            requiredImports.add('import java.util.Map;');
          }
          // Add other type checks and imports as needed
        });
        const imports = Array.from(requiredImports).join('\n');
        return `package com.asyncapi.models;\n\n${imports}\n\n${content}`;
      }
    }
  };

  const otherModelTypes = ['enum', 'union'];
  otherModelTypes.forEach(type => {
    websocketJavaPreset[type] = {
      self({ content }) {
        return addPackage(content);
      }
    };
  });

  const combinedPresets = [
    {
      preset: JAVA_COMMON_PRESET,
      options: {
        equal: true,
        hashCode: false,
        classToString: true,
        marshalling: false
      }
    },
    websocketJavaPreset
  ];

  return await Models({ asyncapi, language: 'java', format: 'toPascalCase', presets: combinedPresets});
}