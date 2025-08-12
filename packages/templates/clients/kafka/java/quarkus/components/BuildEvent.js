import { Text } from "@asyncapi/generator-react-sdk";
import { FormatHelpers } from "@asyncapi/modelina";


function generateAddMethodCalls(headerInfo) {
  return headerInfo.map((header, index) => {
    // Convert header name to camelCase (or whatever format you prefer for variable names)
    const variableName = FormatHelpers.toCamelCase(header.schemaId);
    const indentLevel = index === 0 ? '' : '\t\t\t\t\t\t\t  ';

    
    // Return the formatted .add() method call
    return `${indentLevel}.add("${header.name}", ${variableName}.getBytes())`;
  }).join('\n'); // Join the generated .add() calls with new lines
}


export default function BuildEvent({ headerInfo }){

    const addMethodCalls = generateAddMethodCalls(headerInfo);
    console.log("Add Method Calls: ", addMethodCalls);

    return (
        <Text indent={2} newLines={2}>
            {`
    // Create Kafka headers based on AsyncAPI spec
    io.smallrye.reactive.messaging.kafka.api.OutgoingKafkaRecordMetadata<String> metadata = 
        io.smallrye.reactive.messaging.kafka.api.OutgoingKafkaRecordMetadata.<String>builder()
            .withHeaders(io.smallrye.reactive.messaging.kafka.api.KafkaHeaders.of()
                ${addMethodCalls})
            .build();

    Record<String, String> record = Record.of(requestId, payload).addMetadata(metadata); // not sure about this payload thing !!! ask lukasz

            `}
        </Text>
    );


}