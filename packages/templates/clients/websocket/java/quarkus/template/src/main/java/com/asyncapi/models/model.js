import { Models } from '../../../../../../../../../../../../components/src/components/models.js';

export default async function({ asyncapi }) {
  const imports = [
    'import io.quarkus.websockets.next.WebSocket;',
    'import io.quarkus.websockets.next.Service;'
  ];

  const websocketJavaPreset = {
    class: {
      self({ content, dependencyManager }) {
        return `@Websocket\n${content}`;
      },
      property({ content, property }) {
        if (property.property && property.property.type === 'Integer') {
          return `@Service\n${content}`;
        }
        return content;
      },
      additionalContent({content, }){
        return (
          `@Override
          public boolean equals(Object o) {
              if (this == o) {
                  return true;
              }
              if (o == null || getClass() != o.getClass()) {
                  return false;
              }
              Name event = (Nmae) o;
              return Objects.equals(this.payload, event.payload);
          }`)
      }
    }
  };

  return await Models({ asyncapi, language: 'java', format: 'toPascalCase', presets: [websocketJavaPreset]});
}