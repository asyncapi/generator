import { File } from "@asyncapi/generator-react-sdk";
import { ProducerDependencies } from "../../../../../../components/dependencies/ProducerDependencies";
import ClientProducer from "../../../../../../components/ClientProducer";
import { getOperationMessages, getServer } from "@asyncapi/generator-helpers";
import { FormatHelpers } from "@asyncapi/modelina";



export default async function ({ asyncapi, params }) {

    const server = getServer(asyncapi.servers(), params.server);
    const operations = asyncapi.operations();
    const channels = asyncapi.channels();
    

    const receiveOperations = operations.filterByReceive();
    

    console.log("Receive Operations: ", receiveOperations);
    
    
    return receiveOperations.map((operation) => {
        const topicName = FormatHelpers.toCamelCase(operation._json.channel['x-parser-unique-object-id']);
        const producerName = FormatHelpers.upperFirst(topicName) + "Producer";
        const producerFileName = FormatHelpers.upperFirst(`${producerName}.java`);
        const messages = getOperationMessages(operation);
        const messageHeader = messages[0].headers()._json.properties
        console.log("Message headers ", messageHeader);

        console.log("Producer Name: ", producerFileName);
        console.log(operation.id());
        
        return (
        <File name={producerFileName}>
            <ProducerDependencies />
            <ClientProducer className={producerName} operation={operation} headers={messageHeader}/>
        </File>
        );
    });
}


/*Old code for reference. -----> Need to make sure I get the correct producer by Lukasz and that it is the right way to do it.
ask about the channel/topic naming and the name of the producer I should use

Also ask how could I dynamically use the models generated, like how would I know the right one so i can call them !!! cause I need a payload
     - I think it should be based on the message payload we are sending costingRequestV1 & costingResponse 
ask about this response thing:  adeo-{env}-case-study-COSTING-RESPONSE-{version}


Confirm if serializer is by default for like json of other things !!!!



receiveOperations.forEach((operation) => {
        console.log("Operation ID: ", operation.id());
        const tmp = getOperationMessages(operation)
        console.log("Operation Messages: ", tmp);
    });


    
// channels.all().forEach(([channelName, channel]) => {
    //     console.log(`Channel Name: ${channelName}`);
    //     console.log(`Channel Details: ${JSON.stringify(channel, null, 2)}`);
    // });


    operations.filterByReceive().forEach((operation) => {
        // console.log(operation);
        // console.log(`Operation ID: ${operation.id()}`);
        // console.log(operation._json.channel['x-parser-unique-object-id']);
    });
*/