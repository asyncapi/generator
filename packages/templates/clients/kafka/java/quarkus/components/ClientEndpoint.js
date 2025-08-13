import { Text } from "@asyncapi/generator-react-sdk";
import { EndpointFields } from "./EndpointFields";
import { ProduceEvent } from "./ProduceEvent";



export default function ClientEndpoint({ correctPath, className, operations }) {
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
        <EndpointFields receiveOperations={receiveOperations} />
        <ProduceEvent receiveOperations={receiveOperations}/>
        
        </Text>
    );

}
