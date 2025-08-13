import { Text } from "@asyncapi/generator-react-sdk";
import { FormatHelpers } from "@asyncapi/modelina";
import BuildEvent from "./BuildEvent";



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

export default function SendEvent({ headers, eventName }){
    
    const headerInfo = extractHeaderInfo(headers);
    console.log("Header Info: ", headerInfo);

    const senderSignature = headerInfo.map(header => {
        return FormatHelpers.upperFirst(FormatHelpers.toCamelCase(header.type)) + " " + FormatHelpers.toCamelCase(header.schemaId);
    });
    // console.log("Sender Signature: ", senderSignature);
    const replyTopic = (senderSignature.includes("String replyTopic")) ? "replyTopic" : "";
    const requestId = (senderSignature.includes("String requestId")) ? "" : "String requestId = UUID.randomUUID().toString();";


    return (
        <>
            <Text indent={2} newLines={2}>
            {`public String send${eventName}(ComDotAdeoDotCasestudyDotCostingrequestDotCostingRequestPayload payload, 
                                             ${senderSignature.join(', ')}) {

    ${requestId}`}
                </Text>
                <BuildEvent headerInfo={headerInfo}/>
                <Text indent={2}>
                    {`
          ${eventName}Emitter.send(message);
          logger.infof("Sent costing request with ID: %s to topic with reply-to: %s", requestId, ${replyTopic});
    }catch (com.fasterxml.jackson.core.JsonProcessingException e) {
          logger.errorf("Failed to serialize payload: %s", e.getMessage());
          throw new RuntimeException("Failed to serialize costing request", e);
    }


    return requestId;`}
    </Text>
    <Text>
    {`
    }
}`}
            </Text>
        </>
    );



}


/**
 * 
 * logger.info("Sending event: " + ${eventName}.class.getSimpleName());
           
           ${eventName}Emitter.send(new Record<>(Map.of(${senderSignature.map(name => `"${FormatHelpers.toCamelCase(name)}"`, name).join(', ')})));
           logger.info("Event sent successfully.");
 */