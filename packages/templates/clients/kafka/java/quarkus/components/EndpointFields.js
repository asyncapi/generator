import { Text } from '@asyncapi/generator-react-sdk';
import { FormatHelpers } from '@asyncapi/modelina';


export function EndpointFields({ receiveOperations }) {
    return receiveOperations.map((operation) => {
        const topicName = FormatHelpers.toCamelCase(operation._json.channel['x-parser-unique-object-id']);
        const producerName = FormatHelpers.upperFirst(topicName) + "Producer";

        return (
            <Text newLines={2}>
                {`
    @Inject
    ${producerName} producer;`}
            </Text>
        );
    });
  
}
