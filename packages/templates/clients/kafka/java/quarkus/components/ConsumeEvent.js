import { Text } from '@asyncapi/generator-react-sdk';


export default function ConsumeEvent({ eventName }){

    return(
        <Text indent={2} newLines={2}>
            {`
    @Incoming("costing-response-in") // is this the right topic name? Make sure they are consisten to right topics for event processing
    public void consume${eventName}(Record<String, String> record) {
        logger.infof("Got a costing response: %s - %s", record.key(), record.value());
            
            // TODO: Add your business logic here
            // - Parse the response payload using your generated models
            // - Extract correlation ID from headers to match with original request
            // - Handle success/error scenarios as needed for your application
    }
}`}
        </Text>
            
    );


}