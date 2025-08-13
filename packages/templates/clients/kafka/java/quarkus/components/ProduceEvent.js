import { Text } from "@asyncapi/generator-components";
import { FormatHelpers } from "@asyncapi/modelina";


export function ProduceEvent({ receiveOperations }) {

    return receiveOperations.map((operation) => {
        const topicName = FormatHelpers.toCamelCase(operation._json.channel['x-parser-unique-object-id']);
        const producerName = FormatHelpers.upperFirst(topicName) + "Producer";

        return (
        <Text newLines={1}>
            {`
    @POST
    public Response produceEvent(String requestId, String replyTopic, String requesterId, Integer requesterCode) {
        // Logic to produce an event to Kafka

        // static for now
        ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload payload = new ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload();
        payload.setProductId("10");

        producer.send${producerName}(payload, requestId, replyTopic, requesterId, requesterCode);
        

        return Response.accepted().build();
    }
}`}
        </Text>
    );

    })
    
}
