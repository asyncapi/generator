import { FormatHelpers } from "@asyncapi/modelina";
import { File } from "@asyncapi/generator-react-sdk";
import { ConsumerDependencies } from "../../../../../../components/dependencies/ConsumerDependencies";
import ClientConsumer from "../../../../../../components/ClientConsumer";




export default async function ({ asyncapi, params }) {

    const operations = asyncapi.operations();
    const sendOperations = operations.filterBySend();

     return sendOperations.map((operation) => {
        const topicName = FormatHelpers.toCamelCase(operation._json.channel['x-parser-unique-object-id']);
        const consumerName = FormatHelpers.upperFirst(topicName) + "Consumer";
        const consumerFileName = FormatHelpers.upperFirst(`${consumerName}.java`);
        
        return (
        <File name={consumerFileName}>
            <ConsumerDependencies />
            <ClientConsumer className={consumerName}/>
        </File>
        );


     });

}