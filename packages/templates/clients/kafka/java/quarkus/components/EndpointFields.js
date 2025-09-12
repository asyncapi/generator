import { Text } from '@asyncapi/generator-react-sdk';
import { toCamelCase, upperFirst } from '@asyncapi/generator-helpers';

export function EndpointFields({ sendOperations, channels }) {
  if (!sendOperations || sendOperations.length === 0) {
    return null;
  }

  return (
    <>
      {sendOperations.map((operation, index) => {
        const topicName = toCamelCase(operation.channels()[index].id());
        const producerName = `${upperFirst(topicName)  }Producer`;

        return (
          <Text key={producerName} newLines={2}>
            {`
    @Inject
    ${producerName} producer;`}
          </Text>
        );
      })}
     
      {channels.length > 1 && (
        <Text newLines={2}>
          {`
    @Inject
    @Channel("middle-out")
    Emitter<String> middleEmitter;

    // Modify DTO for BL
    public static class DTO{
        public String id;
        public String value;
    }`}
        </Text>
      )}
    </>
  );
}
