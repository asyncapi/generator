import { FileHeaderInfo } from "@asyncapi/generator-components";
import { getInfo, getServer } from "@asyncapi/generator-helpers"
import { EndpointDependencies } from "../../../../../../components/dependencies/EndpointDependencies";
import ClientEndpoint from "../../../../../../components/ClientEndpoint";

    /*
    
    this is where I will call the rest api to create a message from the producer
    then give the response of the consumer consuming the message
    
     */
export default async function ({ asyncapi, params }) {
    const info = getInfo(asyncapi);
    const server = getServer(asyncapi.servers(), params.server);
    const channels = asyncapi.channels();
    const name = "CostingResource";
    const fileName = `${name}.java`;
    const operations = asyncapi.operations();

    return (
    <File name={fileName}>
        <FileHeaderInfo
            info={info}
            server={server}
            language="java"
        />
        <EndpointDependencies />
        <ClientEndpoint className={name} operations={operations} channels={channels} />
    </File>
    );

}
