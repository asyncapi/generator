import { Models } from '../../../../../../../../../../components/src/components/models';

export default async function({ asyncapi }) {
  const a = asyncapi.components().schemas(); // this give the property name so how can I use it properly now 
  // console.log('DEBUG PROPERTY :', a);
  const imports = [
    'import io.quarkus.websockets.next.OnClose;',
    'import io.quarkus.websockets.next.OnOpen;',
    'import io.quarkus.websockets.next.OnTextMessage;',
    'import io.quarkus.websockets.next.WebSocket;',
    'import io.quarkus.websockets.next.WebSocketConnection;',
    'import jakarta.inject.Inject;'
  ];

  const websocketJavaPreset = {
    class: {
      self({ content, dependencyManager }) {
        return `@Websocket\n${content}`;
      },
      property({ content, property }) {
        if (property.property && property.property.type === 'Integer') { // careful the property might not be a .type, might be .serializationType
          return `@Service\n${content}`;
        }
        return content;
      },
      additionalContent({content, }){
        return `@Override
                public boolean equals(Object o) {
                    if (this == o) {
                        return true;
                    }
                    if (o == null || getClass() != o.getClass()) {
                        return false;
                    }
                    Name event = (Nmae) o;
                    return Objects.equals(this.payload, event.payload);
                }`
      }
    }
  };

  return await Models({ asyncapi, language: 'java', format: 'toPascalCase', presets: [websocketJavaPreset]});
}