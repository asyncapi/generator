import { Text } from "@asyncapi/generator-react-sdk";
import { EndpointFields } from "./EndpointFields";
import { ProduceEvent } from "./ProduceEvent";
import { MiddleService } from "./MiddleService";



export default function ClientEndpoint({ className, operations, channels, correctPath }) {
    if(!correctPath) {
        correctPath = "/";
    }
    
    const receiveOperations = operations.filterByReceive();

    return (
        <Text newLines={2}>
        <Text newLines={2}>
            {`
@Path("${correctPath}")  
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class ${className}{`}
        </Text>
        <EndpointFields receiveOperations={receiveOperations} channels={channels} />
        <ProduceEvent receiveOperations={receiveOperations}/>
        <MiddleService channels={channels} />
        <Text newLines={2}>
            {`
}`}
        </Text>
        
        </Text>
    );

}
