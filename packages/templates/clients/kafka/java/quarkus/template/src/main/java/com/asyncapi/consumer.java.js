import { getOperationMessages } from "@asyncapi/generator-helpers";
import { FormatHelpers } from "@asyncapi/modelina";
import { ConsumerDependencies } from "../../../../../../components/dependencies/ConsumerDependencies";
import ClientConsumer from "../../../../../../components/ClientConsumer";




export default async function ({ asyncapi, params }) {


    const operations = asyncapi.operations();

    console.log("Consumer Operations: ", operations);

    const sendOperations = operations.filterBySend();
    console.log("Consume Operations: ", sendOperations);

     return sendOperations.map((operation) => {
        const topicName = FormatHelpers.toCamelCase(operation._json.channel['x-parser-unique-object-id']);
        const consumerName = FormatHelpers.upperFirst(topicName) + "Consumer";
        const consumerFileName = FormatHelpers.upperFirst(`${consumerName}.java`);
        
        const messages = getOperationMessages(operation);
        // console.log("Message: ", getMessageExamples(message[0]));
        const messageHeader = messages[0].headers()._json.properties
        console.log("Message headers ", messageHeader);

        console.log("Consumer Name: ", consumerFileName);
        console.log(operation.id());
        
        return (
        <File name={consumerFileName}>
            <ConsumerDependencies />
            <ClientConsumer className={consumerName}/>
        </File>
        );


     });

}