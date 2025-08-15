import { Text } from '@asyncapi/generator-react-sdk';
import { FormatHelpers } from '@asyncapi/modelina';


export function EndpointFields({ receiveOperations, channels }) {
    if (!receiveOperations || receiveOperations.length === 0) {
        return null;
    }

    return (
        <>
            {receiveOperations.map((operation) => {
                const topicName = FormatHelpers.toCamelCase(operation._json.channel['x-parser-unique-object-id']);
                const producerName = FormatHelpers.upperFirst(topicName) + "Producer";

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
