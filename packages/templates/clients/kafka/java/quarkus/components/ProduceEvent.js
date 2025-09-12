import { Text } from '@asyncapi/generator-react-sdk';
import { toCamelCase, upperFirst } from '@asyncapi/generator-helpers';

export function ProduceEvent({ sendOperations }) {
  return sendOperations.map((operation, index) => {
    const topicName = toCamelCase(operation.channels()[index].id());
    const producerName = `${upperFirst(topicName)  }Producer`;

    return (
      <Text newLines={1}>
        {`
    /**
     *  Simple rest endpoint to simulate the event production
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

        System.out.printf("Sending request: id=%s, value=%s%n", returnedID, returnedValue);

        producer.send${producerName}(returnedID, returnedValue);
        

        return Response.accepted().build();
    }`}
      </Text>
    );
  });
}