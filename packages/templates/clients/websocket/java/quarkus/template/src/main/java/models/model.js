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
        // console.log('DEBUG CONTENT1:', content);
        // for(const imp of imports) {
        //   dependencyManager.addDependency(imp);
        // }
        return `@Websocket\n${content}`;
      },
      property({ content, property }) {
        // console.log('DEBUG CONTENT2:', content);
        // console.log('DEBUG PROPERTY2:\n', property);
        if (property.property && property.property.type === 'Integer') { // careful the property might not be a .type, might be .serializationType
          // console.log("Got Here Shuaib!!!!\n\n\n");
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



/**
 * 
 * how it works
 * class.self adds @Websocket to the top of the class

property.self runs for each property

It checks propertyName === 'lumens' and injects @Service before the property line


// note later needs to be scalable once I know how to set up a java websicket class

class: {
      self({ content, dependencyManager }) {
        dependencyManager.addDependency('import org.springframework.stereotype.Service;');
        return `@Websocket\n${content}`;
      },

  
might have to add a package name at the top of the generated models!!!!!!

// this is just he models, 

I need to generate the config file which will allow class of type Model to send websocket messages


add equals and hascode methods, and other needed methods

 */