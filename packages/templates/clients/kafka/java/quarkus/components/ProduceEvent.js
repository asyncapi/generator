import { Text } from "@asyncapi/generator-react-sdk";
import { FormatHelpers } from "@asyncapi/modelina";



export function ProduceEvent({ receiveOperations }) {
    return receiveOperations.map((operation) => {
        const topicName = FormatHelpers.toCamelCase(operation._json.channel['x-parser-unique-object-id']);
        const producerName = FormatHelpers.upperFirst(topicName) + "Producer";

        return (
        <Text newLines={1}>
                {`
    /**
     *  Simple rest endpoint to help simulate the event production
     *  Normally would be done by a real life business event
     * */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response produceEvent(DTO request) {
        // Logic to produce an event to Kafka
        System.out.println(">>> Raw body: " + request);

        if (request == null) {
            System.out.println("Request is null - no body provided");
            return Response.status(Response.Status.BAD_REQUEST).entity("Request body is required").build();
        }

        String returnedID = (request.id != null) ? request.id : "";
        String returnedValue = (request.value != null) ? request.value : "";

        System.out.printf("Sending request: id=%s, value=%s%n", request.id, request.value);

        producer.send${producerName}(returnedID, returnedValue);
        

        return Response.accepted().build();
    }`}
        </Text>
        );

        })
    }