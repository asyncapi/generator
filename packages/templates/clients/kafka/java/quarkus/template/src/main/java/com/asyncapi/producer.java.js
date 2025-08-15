import { File } from "@asyncapi/generator-react-sdk";
import { ProducerDependencies } from "../../../../../../components/dependencies/ProducerDependencies";
import ClientProducer from "../../../../../../components/ClientProducer";
import { FormatHelpers } from "@asyncapi/modelina";



export default async function ({ asyncapi, params }) {

    const operations = asyncapi.operations();    

    const receiveOperations = operations.filterByReceive();    
    
    return receiveOperations.map((operation) => {
        const topicName = FormatHelpers.toCamelCase(operation._json.channel['x-parser-unique-object-id']);
        const producerName = FormatHelpers.upperFirst(topicName) + "Producer";
        const producerFileName = FormatHelpers.upperFirst(`${producerName}.java`);
        
        return (
        <File name={producerFileName}>
            <ProducerDependencies />
            <ClientProducer className={producerName}/>
        </File>
        );
    });
}