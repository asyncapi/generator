import { Text } from "@asyncapi/generator-react-sdk";
import { FormatHelpers } from "@asyncapi/modelina";

export default function SendEvent({ eventName }){
  const className = FormatHelpers.upperFirst(eventName);
    
    return (
            <Text newLines={2}>
            {`
    public String send${className}(String requestId, String value) {
      try{
          // Generate requestId if null
          if (requestId == null || requestId.trim().isEmpty()) {
              requestId = UUID.randomUUID().toString();
          }     
          
          if(value == null || value.trim().isEmpty()) {
              value = "ASYNCAPI - TEST";
          }
          Message<String> message = KafkaRecord.of(requestId, value);
          ${eventName}Emitter.send(message);
          logger.infof("Sent costing request with ID: %s to topic with reply-to: %s", requestId, value);
      }catch (Exception e) {
          throw new RuntimeException(String.format("Failed to produce event: %s", e.getMessage()));
      }


      return requestId;
    }
}`}
            </Text>
    );
}


/**
 * 
 * 
 * 
 * // keeping it simple with just sending key,value later will send something more to specs
// don't forget about json serialization if I end up using a real object, becasue current its string serialized for send into kafka log

 * logger.info("Sending event: " + ${eventName}.class.getSimpleName());
           
           ${eventName}Emitter.send(new Record<>(Map.of(${senderSignature.map(name => `"${FormatHelpers.toCamelCase(name)}"`, name).join(', ')})));
           logger.info("Event sent successfully.");
           
function extractHeaderInfo(headers) {
  const headerInfo = [];

  for (const [headerName, headerDetails] of Object.entries(headers)) {
    // Extract the necessary information: name and type
    const name = headerName;
    const type = headerDetails.type;
    
    // Optionally, you can include more details like description, example, etc.
    const description = headerDetails.description || null;
    const example = headerDetails.example || null;
    const schemaId = headerDetails['x-parser-schema-id'] || null;

    // Push the extracted information into the result array
    headerInfo.push({
      name,
      type,
      description,
      example,
      schemaId
    });
  }

  return headerInfo;
}



const headerInfo = extractHeaderInfo(headers);
    console.log("Header Info: ", headerInfo);

    const senderSignature = headerInfo.map(header => {
        return FormatHelpers.upperFirst(FormatHelpers.toCamelCase(header.type)) + " " + FormatHelpers.toCamelCase(header.schemaId);
    });
    // console.log("Sender Signature: ", senderSignature);
    const replyTopic = (senderSignature.includes("String replyTopic")) ? "replyTopic" : "";
    const requestId = (senderSignature.includes("String requestId")) ? "" : "String requestId = UUID.randomUUID().toString();";


    ${requestId}`}
                </Text>
                <BuildEvent headerInfo={headerInfo}/>
                <Text indent={2}>
                    {`


                    /**
 * // Create metadata with headers
              OutgoingKafkaRecordMetadata<String> metadata = OutgoingKafkaRecordMetadata.<String>builder()
                  .withHeaders(new RecordHeaders()
                          .add("REQUEST_ID", requestId.getBytes())
  											  .add("REPLY_TOPIC", replyTopic.getBytes())
  											  .add("REQUESTER_ID", requesterId.getBytes())
  											  .add("REQUESTER_CODE", requesterCode.getBytes()))
                  .build();

catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            logger.errorf("Failed to serialize payload: %s", e.getMessage());
            throw new RuntimeException("Failed to serialize costing request", e);
      }
 */

