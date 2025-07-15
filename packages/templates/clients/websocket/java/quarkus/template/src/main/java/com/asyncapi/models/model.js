import { JAVA_COMMON_PRESET } from '@asyncapi/modelina';
import { Models } from '@asyncapi/generator-components';

export default async function({ asyncapi }) {
  const websocketJavaPreset = {
    class: {
      self({ content, dependencyManager }) {
        return `package com.asyncapi.models;\n\n${content}`;
      },
      property({ content, property }) {
        if (property.property && property.property.type === 'Integer') {
          return `@Service\n${content}`;
        }
        return content;
      },
      additionalContent({ content }) {
        return content;
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