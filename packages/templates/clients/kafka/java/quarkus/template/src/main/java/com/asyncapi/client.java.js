import { FileHeaderInfo } from "@asyncapi/generator-components";
import { getInfo, getServer } from "@asyncapi/generator-helpers";



export default async function ({ asyncapi, params }) {
    const info = getInfo(asyncapi);
    const server = getServer(asyncapi.servers(), params.server);
    /*
    
    this is where I will call the rest api to create a message from the producer
    then give the response of the consumer consuming the message
    
     */

    return (
    <File name="Client.java">
        <FileHeaderInfo
            info={info}
            server={server}
            language="java"
        />
    </File>
    );

}
