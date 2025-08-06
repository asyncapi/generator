import { JAVA_COMMON_PRESET } from '@asyncapi/modelina';
import { Models } from '@asyncapi/generator-components';

export default async function({ asyncapi }) {
  const websocketJavaPreset = {
    class: {
      self({ content, model }) {
        // Temporary solution to handle imports dynamically
        console.log("Processing class:", model.name, model.type);

        const requiredImports = new Set();
        requiredImports.add('import java.util.Objects;');
        Object.values(model.properties).forEach(property => {
          const type = property.property.type;

          if (type === 'Map<String, Object>') {
            requiredImports.add('import java.util.Map;'); // need to be better 
          }
          // Add other type checks and imports as needed
        });
        const imports = Array.from(requiredImports).join('\n');
        return `package com.asyncapi.models;\n\n${imports}\n\n${content}`;

      },
      property({ content }) {
        return content;
      },
      additionalContent({ content }) {
        return content;
      }
    },
    enum:{
      self({ content, model}) {
        console.log("Processing enum content:", model.name, model.type);
        return `package com.asyncapi.models;\n\n${content}`;
      }
    },
     interface: {
      self({ content }) {
        // doesn't enter here for some reason ----------> Issue casue not adding package and not compiling, doing it by hand!!!
        console.log("Processing interface content:");
        return `package com.asyncapi.models;\n\n${content}`;
      }
    }
  };

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