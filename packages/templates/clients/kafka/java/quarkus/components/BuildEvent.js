import { Text } from "@asyncapi/generator-react-sdk";
import { FormatHelpers } from "@asyncapi/modelina";


function generateAddMethodCalls(headerInfo) {
  return headerInfo.map((header, index) => {
    // Convert header name to camelCase (or whatever format you prefer for variable names)
    const variableName = FormatHelpers.toCamelCase(header.schemaId);
    const indentLevel = index === 0 ? '' : '\t\t\t\t\t\t\t\t\t\t\t  ';

    
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
    try{
            String payloadJson = new ObjectMapper().writeValueAsString(payload);

            // Create metadata with headers
            OutgoingKafkaRecordMetadata<String> metadata = OutgoingKafkaRecordMetadata.<String>builder()
                .withHeaders(new RecordHeaders()
                        ${addMethodCalls})
                .build();

            org.eclipse.microprofile.reactive.messaging.Message<String> message = KafkaRecord.of(requestId, payloadJson)
                .addMetadata(metadata); // not sure about this payload thing !!! ask lukasz

                `}
        </Text>
    );


}